import { INVALID_MOVE } from 'boardgame.io/core';
import { GAME_NAME, BOARD_WIDTH, BOARD_HEIGHT, NUM_CARDS, CARDS_PER_HAND } from './config';

export const Game = {
  name: GAME_NAME,

  setup: (ctx) => {
    const G = {
      cells: Array(BOARD_HEIGHT * BOARD_WIDTH).fill(null),
      players: {
        '0': []
      },
      deck: [...Array(NUM_CARDS).keys()],
      started: false
    }

    G.deck = ctx.random.Shuffle(G.deck);
    // copies player 0 initial state to other players
    for (let i = 1; i < ctx.numPlayers; i++) {
      G.players[`${i}`] = JSON.parse(JSON.stringify(G.players['0']));
    }
    // draw cards to players
    for (let i = 0; i < ctx.numPlayers; i++) {
      for (let n = 0; n < CARDS_PER_HAND; n++) {
        G.players[`${i}`].push(G.deck.pop());
      }
    }
    return G;
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