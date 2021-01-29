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
      started: false
    }

    // shuffle deck
    G.deck = ctx.random.Shuffle(G.deck);
    G.deck = G.deck.map(id => new Card(id, ctx.random.D4()));
    
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
    rotateSelectedCard: (G, ctx, amount) => {
      const card = getCurrentPlayerSelectedCard(G, ctx);
      if (card !== null) {
        card.rotation = (card.rotation + 4 + amount) % 4;
      }
    },

    moveSelectedCardIndex: (G, ctx, amount) => {
      const cards = getCurrentPlayerCards(G, ctx);
      const p = G.players[ctx.currentPlayer];
      if (cards.length > 0) {
        p.selectedCardIndex = (amount + p.selectedCardIndex + cards.length) % cards.length;
      }
    },

    // TODO: rename
    clickCell: (G, ctx, cellIndex) => {
      if (G.cells[cellIndex] !== null) {
        return INVALID_MOVE;
      }
      const hand = getCurrentPlayerCards(G, ctx);
      const cardIndex = getCurrentPlayerSelectedCardIndex(G, ctx);
      G.cells[cellIndex] = hand.splice(cardIndex, 1)[0];

      if (cardIndex > hand.length - 1) {
        setCurrentPlayerSelectedCardIndex(G, ctx, hand.length - 1);
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