import { INVALID_MOVE } from 'boardgame.io/core';
import { Card } from './Card';
import { GAME_NAME, BOARD_WIDTH, BOARD_HEIGHT, NUM_CARDS, CARDS_PER_HAND } from './config';
import { getCurrentPlayerCards, getCurrentPlayerSelectedCard, getCurrentPlayerSelectedCardIndex, setCurrentPlayerSelectedCardIndex } from './utils'

export const Game = {
  name: GAME_NAME,

  setup: (ctx) => {
    const G = {
      cells: Array(BOARD_HEIGHT * BOARD_WIDTH).fill(null),
      players: {},
      deck: [...Array(NUM_CARDS).keys()],
      started: false,
      zIndex: 0
    }

    // shuffle deck
    G.deck = ctx.random.Shuffle(G.deck);
    G.deck = G.deck.map(id => new Card(id, ctx.random.D4()));

    // put card in the middle of the board
    const middleX = Math.floor(BOARD_WIDTH / 2);
    const middleY = Math.floor(BOARD_HEIGHT / 2);
    G.cells[middleY * BOARD_WIDTH + middleX] = G.deck.pop();
    
    // draw cards to players
    for (let i = 0; i < ctx.numPlayers; i++) {
      const playerObj = {
        selectedCardIndex: 0,
        cards: []
      };
      for (let n = 0; n < CARDS_PER_HAND; n++) {
        playerObj.cards.push(G.deck.pop());
      }
      G.players[`${i}`] = playerObj
    }
    return G;
  },

  moves: {
    setPlayerCardRotations: (G, ctx, cardRotations) => {
      const hand = getCurrentPlayerCards(G, ctx);
      for (let i = 0; i < hand.length; i++) {
        hand[i].rotation = ((cardRotations[i] % 4) + 4) % 4; // deals with negative numbers
      }
    },

    // TODO: rename
    clickCell: (G, ctx, cellIndex, zIndex, card) => {
      if (G.cells[cellIndex] !== null) {
        return INVALID_MOVE;
      }

      card.zIndex = zIndex;
      G.cells[cellIndex] = card;
      G.zIndex++;

      // remove card from hand
      const hand = getCurrentPlayerCards(G, ctx);
      const i = hand.findIndex(c => c.id === card.id);
      if (i >= 0) {
        hand.splice(i, 1);
      }

      
      ctx.events.endTurn();
    },

    endTurn: (G, ctx) => {
      ctx.events.endTurn();
    },

    drawCard: (G, ctx) => {
      if (G.deck.length === 0) {
        return;
      }

      getCurrentPlayerCards(G, ctx).push(G.deck.pop());
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