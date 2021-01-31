import { getClientCards, updateCardRotationsOnServer } from "./utils";

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
        <br>Players: `;
    
    Object.entries(state.G.players).forEach(([playerId, playerData]) => {
      console.log(playerId, playerData);
      let str = `Player ${playerId}`;
      if (playerId == this.client.playerID) {
        str += ` (You)`
      }
      if (playerId == state.ctx.currentPlayer) {
        str = `<b>${str}</b>`;
      }
      if (playerData) {
        str += `: ${playerData.cards.length} cards; `;
      } else {
        str += `: not in room; `;
      }
      this.rootElement.innerHTML += str;
    });
    if (state.ctx.currentPlayer == this.client.playerID) {
      this.rootElement.innerHTML += "<br>It's your turn!";
    } else {
      this.rootElement.innerHTML += `<br>Wait, it's player ${state.ctx.currentPlayer}'s turn.`;
    }

    document.getElementById('drawCard').onclick = (e) => {
      this.client.moves.drawCard();
    }

    document.getElementById('endTurn').onclick = (e) => {
      updateCardRotationsOnServer(this.client);
      this.client.moves.endTurn();
    }
  }
}