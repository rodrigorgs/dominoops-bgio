export class MessageView {
  constructor(rootElement, client) {
    this.rootElement = rootElement;
    this.client = client;
  }

  update(state) {
    this.rootElement.innerHTML = `Hold Alt and drag to move board; Hold Alt and use mouse wheel to zoom
        <br>Match ID: <b><tt>${this.client.matchID}</tt></b>
        <br>You have ${state.G.players[state.ctx.currentPlayer].length} cards.`;
    
    if (state.ctx.currentPlayer == this.client.playerID) {
      this.rootElement.innerHTML += "It's your turn!";
    } else {
      this.rootElement.innerHTML += `Wait, it's player ${state.ctx.currentPlayer}'s turn.`;
    }
  }
}