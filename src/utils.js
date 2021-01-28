export function getPlayerCards(G, playerId) {
  return G.players[playerID].cards;
}

export function getCurrentPlayerCards(G, ctx) {
  return G.players[ctx.currentPlayer].cards;
}

export function getClientCards(client) {
  const state = client.getState();
  return state.G.players[client.playerID].cards;
}

export function getClientSelectedCardIndex(client) {
  const state = client.getState();
  return state.G.players[client.playerID].selectedCardIndex;
}

export function getCardAtBoardIndex(client, index) {
  return client.getState().G.cells[index];
}