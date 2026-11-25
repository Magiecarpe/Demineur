/**
 * Main game controller adapted from python_version/Projet_info.py
 */
(() => {
  const boardEl = document.getElementById("board");
  const cellCountEl = document.getElementById("cell-count");
  const minesCountEl = document.getElementById("mines-count");
  const timerEl = document.getElementById("timer");
  const difficultySelect = document.getElementById("difficulty-select");
  const flagModeBtn = document.getElementById("flag-mode-btn");
  const flagModeLabel = document.getElementById("flag-mode-label");
  const restartBtn = document.getElementById("restart-btn");

  const endModal = document.getElementById("end-modal");
  const modalBadge = document.getElementById("modal-badge");
  const modalTitle = document.getElementById("modal-title");
  const modalStats = document.getElementById("modal-stats");
  const modalRestartBtn = document.getElementById("modal-restart-btn");
  const modalCloseBtn = document.getElementById("modal-close-btn");

  let elapsedSeconds = 0;
  let timerId = null;

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }

  function startTimer() {
    if (timerId !== null) return;
    timerId = setInterval(() => {
      elapsedSeconds += 1;
      timerEl.textContent = formatTime(elapsedSeconds);
    }, 1000);
  }

  function stopTimer() {
    if (timerId !== null) {
      clearInterval(timerId);
      timerId = null;
    }
  }

  function resetTimer() {
    stopTimer();
    elapsedSeconds = 0;
    timerEl.textContent = "00:00";
  }

  function updateCounters() {
    cellCountEl.textContent = String(Cell.cellCount);
    minesCountEl.textContent = String(Cell.minesCount);
  }

  function showEndModal(isWin) {
    stopTimer();

    modalBadge.textContent = isWin ? "🏆" : "💥";
    modalTitle.textContent = isWin ? "Victory!" : "Game Over";

    const totalSafeCells = Cell.gridSize * Cell.gridSize - Cell.totalMines;
    modalStats.textContent = isWin
      ? `Cleared ${totalSafeCells} safe cells in ${formatTime(elapsedSeconds)}.`
      : `Cleared ${Cell.openedSafeCells} / ${totalSafeCells} safe cells in ${formatTime(elapsedSeconds)}.`;

    modalRestartBtn.textContent = isWin ? SETTINGS.T_G_E : SETTINGS.T_B_E;
    modalRestartBtn.classList.remove("win", "lose");
    modalRestartBtn.classList.add(isWin ? "win" : "lose");

    endModal.classList.remove("hidden");
  }

  function hideEndModal() {
    endModal.classList.add("hidden");
  }

  function setFlagMode(enabled) {
    Cell.flagMode = enabled;
    flagModeBtn.setAttribute("aria-pressed", String(enabled));
    flagModeBtn.classList.toggle("active", enabled);
    flagModeLabel.textContent = enabled ? "Flag Mode: On" : "Flag Mode: Off";
  }

  function getCellSizeForViewport(preset) {
    const maxBoardWidth = Math.min(window.innerWidth - 64, 620);
    const gapTotal = (preset.gridSize - 1) * 4 + 24;
    const fitted = Math.floor((maxBoardWidth - gapTotal) / preset.gridSize);
    return Math.max(24, Math.min(preset.cellSizePx, fitted));
  }

  function updateBoardSizing() {
    const preset = SETTINGS.PRESETS[difficultySelect.value] || SETTINGS.PRESETS.classic;
    const cellSize = getCellSizeForViewport(preset);
    boardEl.style.setProperty("--grid-size", String(preset.gridSize));
    boardEl.style.setProperty("--cell-size", `${cellSize}px`);
  }

  /**
   * Initialize or restart the game (adapted from Projet_info.py and Cell.New)
   */
  function initGame() {
    const preset = SETTINGS.PRESETS[difficultySelect.value] || SETTINGS.PRESETS.classic;

    hideEndModal();
    resetTimer();

    Cell.all = [];
    Cell.grid = [];
    Cell.gridSize = preset.gridSize;
    Cell.totalMines = preset.minesCount;
    Cell.cellCount = preset.gridSize * preset.gridSize;
    Cell.minesCount = preset.minesCount;
    Cell.openedSafeCells = 0;
    Cell.isGameOver = false;
    Cell.minesPlaced = false;

    boardEl.innerHTML = "";
    updateBoardSizing();

    for (let x = 0; x < Cell.gridSize; x++) {
      const row = [];
      for (let y = 0; y < Cell.gridSize; y++) {
        const cell = new Cell(x, y);
        cell.createButtonElement(boardEl);
        row.push(cell);
      }
      Cell.grid.push(row);
    }

    updateCounters();
  }

  // Wire Cell callbacks
  Cell.onUpdateCounters = updateCounters;
  Cell.onFirstMove = startTimer;
  Cell.onWin = () => showEndModal(true);
  Cell.onLose = () => showEndModal(false);

  // Wire UI controls
  restartBtn.addEventListener("click", initGame);
  difficultySelect.addEventListener("change", initGame);
  flagModeBtn.addEventListener("click", () => setFlagMode(!Cell.flagMode));
  modalRestartBtn.addEventListener("click", initGame);
  modalCloseBtn.addEventListener("click", hideEndModal);
  endModal.addEventListener("click", (event) => {
    if (event.target === endModal) hideEndModal();
  });
  window.addEventListener("resize", updateBoardSizing);

  // Start initial game
  initGame();
})();
