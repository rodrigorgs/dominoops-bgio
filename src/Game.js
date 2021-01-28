import { INVALID_MOVE } from 'boardgame.io/core';
import { Card } from './Card';
import { GAME_NAME, BOARD_WIDTH, BOARD_HEIGHT, NUM_CARDS, CARDS_PER_HAND } from './config';

export const Game = {
  name: GAME_NAME,

  setup: (ctx) => {
    const G = {
      cells: Array(BOARD_HEIGHT * BOARD_WIDTH).fill(null),
      players: {},
      deck: [...Array(NUM_CARDS).keys()],
      started: false
    }

    // shuffle deck
    G.deck = ctx.random.Shuffle(G.deck);
    G.deck = G.deck.map(id => new Card(id, ctx.random.D4()));
    
    // draw cards to players
    for (let i = 0; i < ctx.numPlayers; i++) {
      G.players[`${i}`] = [];
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