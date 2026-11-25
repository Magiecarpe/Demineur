/**
 * Cell class adapted from python_version/cell.py
 */
class Cell {
  static all = [];
  static grid = [];
  static gridSize = 10;
  static totalMines = 20;
  static cellCount = 100;
  static minesCount = 20;
  static openedSafeCells = 0;
  static isGameOver = false;
  static minesPlaced = false;
  static flagMode = false;

  // Callbacks wired by game.js
  static onUpdateCounters = () => {};
  static onFirstMove = () => {};
  static onWin = () => {};
  static onLose = () => {};

  constructor(x, y, isMine = false) {
    this.x = x;
    this.y = y;
    this.isMine = isMine;
    this.isOpened = false;
    this.isFlagged = false;
    this.element = null;

    Cell.all.push(this);
  }

  createButtonElement(boardElement) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "cell";
    btn.setAttribute("role", "gridcell");
    btn.setAttribute("aria-label", `Row ${this.x + 1}, Column ${this.y + 1}`);
    btn.dataset.x = String(this.x);
    btn.dataset.y = String(this.y);

    btn.addEventListener("click", (event) => {
      event.preventDefault();
      if (Cell.flagMode && !this.isOpened) {
        this.rightClickActions();
      } else {
        this.leftClickActions();
      }
    });

    btn.addEventListener("contextmenu", (event) => {
      event.preventDefault();
      this.rightClickActions();
    });

    this.element = btn;
    boardElement.appendChild(btn);
  }

  /**
   * Neighboring cells (adapted from Cell.surrounds in cell.py)
   */
  get surrounds() {
    const neighbors = [];
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const neighbor = Cell.getCellByAxis(this.x + dx, this.y + dy);
        if (neighbor) {
          neighbors.push(neighbor);
        }
      }
    }
    return neighbors;
  }

  /**
   * Number of surrounding mines (adapted from Cell.surrounds_mines)
   */
  get surroundsMines() {
    let mines = 0;
    for (const cell of this.surrounds) {
      if (cell.isMine) mines += 1;
    }
    return mines;
  }

  /**
   * Number of surrounding flags (adapted from Cell.surrounds_flags)
   */
  get surroundsFlags() {
    let flags = 0;
    for (const cell of this.surrounds) {
      if (cell.isFlagged) flags += 1;
    }
    return flags;
  }

  static getCellByAxis(x, y) {
    if (x < 0 || y < 0 || x >= Cell.gridSize || y >= Cell.gridSize) {
      return null;
    }
    return Cell.grid[x][y];
  }

  /**
   * Randomly place mines (adapted from Cell.randomize_mines).
   * Excludes the first-clicked cell so the opening move is never an instant loss.
   */
  static randomizeMines(safeCell = null) {
    const candidates = safeCell
      ? Cell.all.filter((cell) => cell !== safeCell)
      : [...Cell.all];

    // Fisher-Yates shuffle for unbiased random selection
    for (let i = candidates.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
    }

    const mineTotal = Math.min(Cell.totalMines, candidates.length);
    for (let i = 0; i < mineTotal; i++) {
      candidates[i].isMine = true;
    }

    Cell.minesPlaced = true;
  }

  /**
   * Left-click behavior (adapted from Cell.left_click_actions in cell.py)
   */
  leftClickActions() {
    if (Cell.isGameOver) return;

    // Ignore direct left-click on a flagged cell to prevent accidental detonations
    if (this.isFlagged) return;

    // Place mines on the first reveal so the first click is always safe
    if (!Cell.minesPlaced) {
      Cell.randomizeMines(this);
      Cell.onFirstMove();
    }

    // Chording on an already opened cell when surrounding flags match surrounding mines
    if (this.isOpened) {
      if (this.surroundsMines > 0 && this.surroundsMines === this.surroundsFlags) {
        this.chordNeighbors();
      }
      return;
    }

    if (this.isMine) {
      this.showMine();
      return;
    }

    this.revealSafeCell();
    Cell.checkWin();
  }

  /**
   * Reveal all unflagged neighbors when chording on an opened cell
   */
  chordNeighbors() {
    for (const neighbor of this.surrounds) {
      if (Cell.isGameOver) return;
      if (!neighbor.isFlagged && !neighbor.isOpened) {
        if (neighbor.isMine) {
          neighbor.showMine();
          return;
        }
        neighbor.revealSafeCell();
      }
    }
    Cell.checkWin();
  }

  /**
   * Right-click behavior: place or remove a flag (adapted from Cell.right_click_actions)
   */
  rightClickActions() {
    if (Cell.isGameOver || this.isOpened) return;

    if (!this.isFlagged) {
      this.isFlagged = true;
      this.element.classList.add("flagged");
      this.element.textContent = "🚩";
      this.element.setAttribute(
        "aria-label",
        `Row ${this.x + 1}, Column ${this.y + 1}, flagged`
      );
      Cell.cellCount -= 1;
      Cell.minesCount -= 1;
    } else {
      this.isFlagged = false;
      this.element.classList.remove("flagged");
      this.element.textContent = "";
      this.element.setAttribute(
        "aria-label",
        `Row ${this.x + 1}, Column ${this.y + 1}`
      );
      Cell.cellCount += 1;
      Cell.minesCount += 1;
    }

    Cell.onUpdateCounters();
  }

  /**
   * Open this safe cell and flood-fill connected zero-mine cells
   * (adapted from Cell.is_zero & Cell.show_cell in cell.py)
   */
  revealSafeCell() {
    const queue = [this];

    while (queue.length > 0) {
      const current = queue.shift();
      if (current.isOpened || current.isMine) continue;

      current.showCell();

      if (current.surroundsMines === 0) {
        for (const neighbor of current.surrounds) {
          if (!neighbor.isOpened && !neighbor.isMine) {
            queue.push(neighbor);
          }
        }
      }
    }
  }

  /**
   * Render a revealed safe cell (adapted from Cell.show_cell in cell.py)
   */
  showCell(isGameEndReveal = false) {
    if (this.isOpened) return;

    // If a cell was mistakenly flagged and gets auto-revealed during flood-fill,
    // restore counters cleanly (matching cell.py lines 213-222)
    if (this.isFlagged) {
      this.isFlagged = false;
      this.element.classList.remove("flagged");
      if (!isGameEndReveal) {
        Cell.minesCount += 1;
      }
    } else if (!isGameEndReveal) {
      Cell.cellCount -= 1;
    }

    this.isOpened = true;
    if (!isGameEndReveal) {
      Cell.openedSafeCells += 1;
    }

    const mineCount = this.surroundsMines;
    this.element.classList.add("opened");

    if (mineCount > 0) {
      this.element.classList.add(`num-${mineCount}`, "chordable");
      this.element.textContent = String(mineCount);
      this.element.setAttribute(
        "aria-label",
        `Row ${this.x + 1}, Column ${this.y + 1}, ${mineCount} surrounding mines`
      );
    } else {
      this.element.textContent = "";
      this.element.setAttribute(
        "aria-label",
        `Row ${this.x + 1}, Column ${this.y + 1}, empty`
      );
    }

    if (!isGameEndReveal) {
      Cell.onUpdateCounters();
    }
  }

  /**
   * Reveal all mines and end the game in defeat (adapted from Cell.show_mine in cell.py)
   */
  showMine() {
    Cell.isGameOver = true;

    for (const cell of Cell.all) {
      if (cell.isMine) {
        cell.element.classList.remove("flagged");
        cell.element.classList.add("mine");
        cell.element.textContent = "💣";
        if (cell === this) {
          cell.element.classList.add("mine-triggered");
        }
      } else if (cell.isFlagged) {
        cell.element.classList.remove("flagged");
        cell.element.classList.add("wrong-flag");
        cell.element.textContent = "✕";
      } else {
        cell.showCell(true);
      }
    }

    Cell.onLose();
  }

  /**
   * Check whether all non-mine cells have been revealed
   */
  static checkWin() {
    if (Cell.isGameOver) return;

    const totalSafeCells = Cell.gridSize * Cell.gridSize - Cell.totalMines;
    if (Cell.openedSafeCells === totalSafeCells) {
      Cell.isGameOver = true;

      // Auto-flag any remaining unflagged mines so counters finish at 0
      for (const cell of Cell.all) {
        if (cell.isMine && !cell.isFlagged) {
          cell.isFlagged = true;
          cell.element.classList.add("flagged");
          cell.element.textContent = "🚩";
          Cell.cellCount -= 1;
          Cell.minesCount -= 1;
        }
      }

      Cell.onUpdateCounters();
      Cell.onWin();
    }
  }
}
