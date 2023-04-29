import { retrieveAllPossibleMoves } from './moves';

// board state, players cards, current player
export function Mcts(gameData, sideCards, zIndex, currentPlayer) {
  this.players = gameData.players;
  this.deck = gameData.deck;
  this.board = gameData.cells;
  this.sideCards = sideCards;
  this.zIndex = zIndex;
  this.currentPlayer = currentPlayer;

  console.log(gameData);
}

Mcts.prototype.getBestMove = function() {
  return retrieveAllPossibleMoves(
    this.board,
    this.cards,
    this.sideCards,
    this.zIndex,
  );
}

Mcts.prototype.select = function() {

}

Mcts.prototype.expand = function() {
  const moves = retrieveAllPossibleMoves(
    this.board,
    this.getCurrentPlayerCards(),
    this.sideCards,
    this.zIndex
  );

}

Mcts.prototype.simulate = function() {

}

Mcts.prototype.backpropagate = function() {

}

Mcts.prototype.getCurrentPlayerCards = function() {
  return players[currentPlayer].cards;
}
