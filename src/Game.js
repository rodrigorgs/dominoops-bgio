import { INVALID_MOVE } from 'boardgame.io/core';

export const BOARD_WIDTH = 6;
export const BOARD_HEIGHT = 4;

export const Game = {
  setup: () => ({ cells: Array(BOARD_HEIGHT * BOARD_WIDTH).fill(null) }),

  turn: {
    moveLimit: 1,
  },

  moves: {
    clickCell: (G, ctx, id) => {
      if (G.cells[id] !== null) {
        return INVALID_MOVE;
      }
      G.cells[id] = ctx.currentPlayer;
    },
  },

  endif: (G, ctx) => {
    // TODO
  }
};