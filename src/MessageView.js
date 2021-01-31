import { getClientCards } from "./utils";

export class MessageView {
  constructor(rootElement, client) {
    this.rootElement = rootElement;
    this.client = client;
  }

  update(state) {
    this.rootElement.innerHTML = `
        <button id="drawCard">Draw card</button>
        <button id="endTurn">End turn</button>
        Match ID: <b><tt>${this.client.matchID}</tt></b>
        <br/><b>Click and drag</b> to pan, <b>mouse wheel</b> to zoom; <b>Q</b> and <b>E</e> to rotate card; <b>W</b> to move card to front/back.
        <br>You have ${getClientCards(this.client).length} cards. &mdash; `;
    
    if (state.ctx.currentPlayer == this.client.playerID) {
      this.rootElement.innerHTML += "It's your turn!";
    } else {
      this.rootElement.innerHTML += `Wait, it's player ${state.ctx.currentPlayer}'s turn.`;
    }

    document.getElementById('drawCard').onclick = (e) => {
      this.client.moves.drawCard();
    }

    document.getElementById('endTurn').onclick = (e) => {
      this.client.moves.endTurn();
    }
  }
}