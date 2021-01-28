export class MessageView {
  constructor(rootElement, client) {
    this.rootElement = rootElement;
    this.client = client;
  }

  update(state) {
    this.rootElement.innerHTML = `
        Match ID: <b><tt>${this.client.matchID}</tt></b>
        <br/>Alt+drag to move board; Alt+mouse wheel to zoom; Q and E to rotate card.
        <br>You have ${state.G.players[state.ctx.currentPlayer].length} cards. &mdash; `;
    
    if (state.ctx.currentPlayer == this.client.playerID) {
      this.rootElement.innerHTML += "It's your turn!";
    } else {
      this.rootElement.innerHTML += `Wait, it's player ${state.ctx.currentPlayer}'s turn.`;
    }
  }
}