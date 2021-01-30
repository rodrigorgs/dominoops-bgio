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
  return G.players[ctx.currentPlayer].selectedCardIndex = index;
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