import { LobbyClient } from 'boardgame.io/client';
import { GAME_NAME } from "./config";
import { getClientCards, updateCardRotationsOnServer } from "./utils";

export class MessageView {
  constructor(rootElement, client, appView) {
    this.rootElement = rootElement;
    this.client = client;
    this.appView = appView;
    console.log('appView', appView);
  }

  update(state) {
    console.log('gameover', state.ctx.gameover);
    this.rootElement.innerHTML = ``;
    if (state.ctx.gameover) {
      this.rootElement.innerHTML += `<span style="font-weight: bold; color: red">Player ${state.ctx.gameover.winner} wins!</span>`;
    }
    this.rootElement.innerHTML += `
        <button id="restart" style="display: ${state.ctx.gameover ? 'inline' : 'none'}">Play again</button>
        <button id="drawCard">Draw card</button>
        <button id="endTurn">End turn</button>
        Match ID: <b><tt>${this.client.matchID}</tt></b>
        <br/><b>Click and drag</b> to pan, <b>mouse wheel</b> to zoom; <b>Q</b> and <b>E</e> to rotate card; <b>W</b> to move card to front/back.
        <br>Players: `;
    
    Object.entries(state.G.players).forEach(([playerId, playerData]) => {
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

    document.getElementById('restart').onclick = async (e) => {
      console.log('restart');
      const { protocol, hostname, port } = window.location;
      const server = `${protocol}//${hostname}:${port}`;

      const lobbyClient = new LobbyClient({ server: server });
      const matchID = this.client.matchID;
      const playerID = this.client.playerID;
      const credentials = this.client.credentials;
      console.log('credentials', credentials);
      const { nextMatchID } = await lobbyClient.playAgain(GAME_NAME, matchID, {playerID, credentials});

      await lobbyClient.leaveMatch(GAME_NAME, matchID, {playerID, credentials});

      const res = await lobbyClient.joinMatch(GAME_NAME, nextMatchID, {
        playerID: playerID,
        playerName: `Player ${playerID}`
      });

      this.appView.restart(playerID, nextMatchID, res.playerCredentials);
    }
  }
}