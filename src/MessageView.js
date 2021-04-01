import { LobbyClient } from 'boardgame.io/client';
import { toast } from './utils'
import { GAME_NAME } from './config';
import { getClientCards, updateCardRotationsOnServer } from './utils';

export class MessageView {
  constructor(rootElement, client, appView) {
    this.rootElement = rootElement;
    this.client = client;
    this.appView = appView;
    this.isPlayersTurn = false;
    console.log('appView', appView);
  }

  update(state) {
    if (state === null) {
      return;
    }

    const werePlayersTurn = this.isPlayersTurn;
    this.isPlayersTurn = state.ctx.currentPlayer == this.client.playerID;

    if (!werePlayersTurn && this.isPlayersTurn) {
      toast('É a sua vez!');
    }

    // if (!this.isPlayersTurn) {
    //   if (state.G.lastValidMove == 'endTurn') {
    //     toast(`Player ${state.ctx.currentPlayer} passou a vez`);
    //   } else if (state.G.lastValidMove == 'drawCard') {
    //     toast(`Player ${state.ctx.currentPlayer} cavou uma carta`);
    //   } else if (state.G.lastValidMove == 'clickCell') {
    //     toast(`Player ${state.ctx.currentPlayer} jogou uma carta`);
    //   }
    // }

    this.rootElement.innerHTML = ``;
    if (state.ctx.gameover) {
      this.rootElement.innerHTML += `<span style="font-weight: bold; color: red">Player ${state.ctx.gameover.winner} wins!</span>`;
    }
    // <button id="undo" style="font-weight: ${state.G.movesLeft == 0 ? 'bold' : 'normal'}">Undo</button>
    this.rootElement.innerHTML += `
        ID da partida: <b><tt>${this.client.matchID}</tt></b> —
        <button id="restart" style="display: ${state.ctx.gameover ? 'inline' : 'none'}">Jogar novamente</button>
        <span style="display: ${this.isPlayersTurn ? 'inline' : 'none'}">
          <span style="color: blue; font-weight: bold;">É sua vez!</span>
          <button id="drawCard" ${state.G.drawsLeft == 0 || state.G.movesLeft == 0 ? 'disabled' : ''}>Cavar carta</button>
          <button id="endTurn" style="font-weight: ${state.G.movesLeft == 0 ? 'bold' : 'normal'}">Passar a vez</button>
        </span>
        <span style="display: ${!this.isPlayersTurn ? 'inline' : 'none'}">
          <span style="color: red">Espere, está na vez do Player ${state.ctx.currentPlayer}.</span>
        </span>
        <br>CONTROLES: <b>W/A/S/D</b>: mover a mesa, <b>roda do mouse</b>: zoom; <b>Q</b>/<b>E</b>: girar carta; <b>F</b>: mover a carta para cima/baixo da carta vizinha.
        <br>JOGADORES: `;

    Object.entries(state.G.players).forEach(([playerId, playerData]) => {
      let str = `Player ${playerId}`;
      if (playerId == this.client.playerID) {
        str += ` (Você)`;
      }
      if (playerId == state.ctx.currentPlayer) {
        str = `<b>${str}</b>`;
      }
      if (playerData) {
        str += `: ${playerData.cards.length} cartas; `;
      } else {
        str += `: não está na sala; `;
      }
      this.rootElement.innerHTML += str;
    });

    document.getElementById('drawCard').onclick = e => {
      this.client.moves.drawCard();
    };

    document.getElementById('endTurn').onclick = e => {
      updateCardRotationsOnServer(this.client);
      this.client.moves.endTurn();
    };

    // document.getElementById('undo').onclick = e => {
    //   this.client.undo();
    // };

    document.getElementById('restart').onclick = async e => {
      console.log('restart');
      const { protocol, hostname, port } = window.location;
      const server = `${protocol}//${hostname}:${port}`;

      const lobbyClient = new LobbyClient({ server: server });
      const matchID = this.client.matchID;
      const playerID = this.client.playerID;
      const credentials = this.client.credentials;
      console.log('credentials', credentials);
      const { nextMatchID } = await lobbyClient.playAgain(GAME_NAME, matchID, { playerID, credentials });

      await lobbyClient.leaveMatch(GAME_NAME, matchID, { playerID, credentials });

      const res = await lobbyClient.joinMatch(GAME_NAME, nextMatchID, {
        playerID: playerID,
        playerName: `Player ${playerID}`,
      });

      this.appView.restart(playerID, nextMatchID, res.playerCredentials);
    };
  }
}
