import { BOARD_WIDTH, BOARD_HEIGHT } from './config';

// TODO: extract class

export function updateCardRotationsOnServer(client) {
  const rotations = getClientCards(client).map(card => card.rotation);
  client.moves.setPlayerCardRotations(rotations);
}

export function getPlayerCards(G, playerId) {
  return G.players[playerID].cards;
}

export function getCurrentPlayerCards(G, ctx) {
  return G.players[ctx.currentPlayer].cards;
}

export function getCurrentPlayerSelectedCardIndex(G, ctx) {
  return G.players[ctx.currentPlayer].selectedCardIndex;
}

export function setCurrentPlayerSelectedCardIndex(G, ctx, index) {
  return (G.players[ctx.currentPlayer].selectedCardIndex = index);
}

export function getCurrentPlayerSelectedCard(G, ctx) {
  const cards = getCurrentPlayerCards(G, ctx);
  const index = getCurrentPlayerSelectedCardIndex(G, ctx);
  if (cards.length > 0 && index >= 0) {
    return cards[index];
  } else {
    return null;
  }
}

export function getClientPlayer(client) {
  const state = client.getState();
  return state.G.players[client.playerID];
}

export function getClientCards(client) {
  const state = client.getState();
  return state.G.players[client.playerID].cards;
}

export function getClientSelectedCardIndex(client) {
  const state = client.getState();
  return state.G.players[client.playerID].selectedCardIndex;
}

export function getClientSelectedCard(client) {
  const cards = getClientCards(client);
  const index = getClientSelectedCardIndex(client);
  if (cards.length > 0 && index >= 0) {
    return cards[index];
  } else {
    return null;
  }
}

export function getCardAtBoardIndex(client, index) {
  return client.getState().G.cells[index];
}

export const CARD_SIDES = {
  TOP: 0,
  RIGHT: 1,
  BOTTOM: 2,
  LEFT: 3,
};

// Get indexes of all four sides of a position on the board (if valid)
export function getSideIndexes(middleIndex) {
  const indexes = [];

  const x = Math.trunc(middleIndex / BOARD_WIDTH);
  const y = middleIndex % BOARD_WIDTH;

  const positionOffsets = [
    { x: -1, y: 0, side: CARD_SIDES.TOP },
    { x: 1, y: 0, side: CARD_SIDES.BOTTOM },
    { x: 0, y: -1, side: CARD_SIDES.LEFT },
    { x: 0, y: 1, side: CARD_SIDES.RIGHT },
  ];

  let newX = 0;
  let newY = 0;

  let offset = null;

  for (let offsetIndex in positionOffsets) {
    offset = positionOffsets[offsetIndex];

    newX = x + offset.x;
    newY = y + offset.y;

    if (newX >= 0 && newX < BOARD_WIDTH && newY >= 0 && newY < BOARD_HEIGHT) {
      indexes.push({ position: newX * BOARD_WIDTH + newY, side: offset.side });
    }
  }

  return indexes;
}
