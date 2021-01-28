import { INVALID_MOVE } from 'boardgame.io/core';
import { GAME_NAME, BOARD_WIDTH, BOARD_HEIGHT, NUM_CARDS, CARDS_PER_HAND } from './config';

// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
}

export const Game = {
  name: GAME_NAME,

  setup: (ctx) => {
    const state = {
      cells: Array(BOARD_HEIGHT * BOARD_WIDTH).fill(null),
      players: {
        '0': []
      },
      deck: [...Array(NUM_CARDS).keys()],
      started: false
    }
    shuffleArray(state.deck);
    // copies player 0 initial state to other players
    for (let i = 1; i < ctx.numPlayers; i++) {
      state.players[`${i}`] = JSON.parse(JSON.stringify(state.players['0']));
    }
    // draw cards to players
    for (let i = 0; i < ctx.numPlayers; i++) {
      for (let n = 0; n < CARDS_PER_HAND; n++) {
        state.players[`${i}`].push(state.deck.pop());
      }
    }
    return state;
  },

  moves: {
    clickCell: (G, ctx, id) => {
      if (G.cells[id] !== null) {
        return INVALID_MOVE;
      }
      G.cells[id] = G.players[ctx.currentPlayer].pop();
      ctx.events.endTurn();
    },

    shuffleDeck: (G, ctx) => {
      shuffleArray(G.deck);
    },

    setStarted: (G, ctx, value) => {
      G.started = value;
    }
  },

  // endif: (G, ctx) => {
  //   // TODO
  // }
};