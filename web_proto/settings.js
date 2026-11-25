/**
 * Game settings and presets adapted from python_version/settings.py
 */
const SETTINGS = {
  // Default classic preset matching settings.py (GRID_SIZE = 10, MINES_COUNT = 100 // 5 = 20)
  PRESETS: {
    classic: {
      gridSize: 10,
      minesCount: 20,
      cellSizePx: 46,
    },
    easy: {
      gridSize: 8,
      minesCount: 10,
      cellSizePx: 50,
    },
    hard: {
      gridSize: 16,
      minesCount: 40,
      cellSizePx: 34,
    },
  },

  // Messages adapted from settings.py
  T_B_E: "You lost, try again",
  T_G_E: "Congrats ! Let's go again",
};
