import { SocketIO } from 'boardgame.io/multiplayer'
import { Client, LobbyClient } from 'boardgame.io/client';
import { Game } from './Game';
import { GAME_NAME, BOARD_WIDTH, BOARD_HEIGHT } from './config';
import { SplashScreen } from './SplashScreen';
import createPanZoom from 'panzoom';

const { protocol, hostname, port } = window.location;
const server = `${protocol}//${hostname}:${port}`;
console.log(server);

class App {
  constructor(rootElement, playerId, matchId) {
    this.client = Client({
      game: Game,
      multiplayer: SocketIO({ server }),
      playerID: playerId,
      matchID: matchId
    });
    this.client.start();
    this.client.subscribe(state => this.update(state));

    this.rootElement = rootElement;
    this.createBoard();
    this.attachListeners();
  }

  createBoard() {
    const rows = [];
    for (let i = 0; i < BOARD_HEIGHT; i++) {
      const cells = [];
      for (let j = 0; j < BOARD_WIDTH; j++) {
        const id = BOARD_WIDTH * i + j;
        cells.push(`<td class="cell" data-id="${id}"></td>`);
      }
      rows.push(`<tr>${cells.join('')}</tr>`);
    }

    // Add the HTML to our app <div>.
    // We’ll use the empty <p> to display the game winner later.
    this.rootElement.innerHTML = `
      <table>${rows.join('')}</table>
      <p class="winner"></p>
    `;
  }

  attachListeners() {
    // This event handler will read the cell id from a cell’s
    // `data-id` attribute and make the `clickCell` move.
    const handleCellClick = event => {
      if (!event.altKey) {
        const id = parseInt(event.target.dataset.id);
        this.client.moves.clickCell(id);
      }
    };
    // Attach the event listener to each of the board cells.
    const cells = this.rootElement.querySelectorAll('.cell');
    cells.forEach(cell => {
      cell.onclick = handleCellClick;
    });
  }

  updateBoard(state) {
    const cellElems = Array.from(document.querySelectorAll('.cell'));
    if (cellElems.length > 0) {
      for (let y = 0; y < BOARD_HEIGHT; y++) {
        for (let x = 0; x < BOARD_WIDTH; x++) {
          const index = x + (y * BOARD_WIDTH);
          const id = state.G.cells[index];
          // cellElems[index].innerHTML = id;
          if (id !== null) {
            this.putCard(id, x, y);
          }
        }
      }
    }
  }

  updateMessage(state) {
    let elem = document.getElementById('msg');
    elem.innerHTML = `Hold Alt and drag to move board; Hold Alt and use mouse wheel to zoom
      <br>Match ID: <b><tt>${this.client.matchID}</tt></b> &mdash;
      <br>You have ${state.G.players[state.ctx.currentPlayer].length} cards.`;
    if (state.ctx.currentPlayer == this.client.playerID) {
      elem.innerHTML += "It's your turn!";
    } else {
      elem.innerHTML += `Wait, it's player ${state.ctx.currentPlayer}'s turn.`;
    }
  }

  // TODO: create separate classes
  updateHand(state) {
    const handElem = document.getElementById('hand');
    handElem.innerHTML = '';
    const cardIds = state.G.players[this.client.playerID];

    cardIds.forEach(cardId => {
      console.log(cardId);
      const imageElem = document.createElement('img');
      imageElem.src = this.getCardImageFromDeck(cardId);
  
      handElem.appendChild(imageElem);
    });
  }

  update(state) {
    if (state === null) return;

    this.updateBoard(state);
    this.updateMessage(state);
    this.updateHand(state);
  }

  // TODO: optimize
  putCard(id, x, y) {
    const image = this.getCardImageFromDeck(id);
    const index = x + (y * BOARD_WIDTH);
    const cellElems = Array.from(document.querySelectorAll('.cell'));

    const imageElem = document.createElement('img');
    imageElem.src = image;
    cellElems[index].innerHTML = '';
    if (id !== null) {
      cellElems[index].appendChild(imageElem);
    }
  }

  getCardImageFromDeck(id) {
    const CARD_INPUT_SIZE = 400;
    const CARD_OUTPUT_SIZE = 400;

    let deck = document.getElementById('deck');

    let canvas = document.createElement('canvas');
    canvas.width = CARD_OUTPUT_SIZE;
    canvas.height = CARD_OUTPUT_SIZE;
    let ctx = canvas.getContext('2d');
    
    const y = Math.floor(id / 10);
    const x = id % 10;
    ctx.beginPath();
    ctx.drawImage(deck, x * CARD_INPUT_SIZE, y * CARD_INPUT_SIZE, CARD_INPUT_SIZE, CARD_INPUT_SIZE, 0, 0, CARD_OUTPUT_SIZE, CARD_OUTPUT_SIZE);
    ctx.fill();

    let croppedImage = canvas.toDataURL('image/png');

    return croppedImage;
  }
}

///////////////////////////////

var element = document.querySelector('#app');
createPanZoom(element, {
  beforeMouseDown: function (e) {
    var shouldIgnore = !e.altKey;
    return shouldIgnore;
  },
  beforeWheel: function (e) {
    var shouldIgnore = !e.altKey;
    return shouldIgnore;
  },
  zoomDoubleClickSpeed: 1 // disable double click
});

///////////////////////////////

const appElement = document.getElementById('app');
SplashScreen(appElement).then(async choice => {
  let playerId, matchId;
  const lobbyClient = new LobbyClient({ server: server });

  if (choice.op == 'create') {
    playerId = '0';
    console.log('numPlayers', choice.numPlayers);
    const res = await lobbyClient.createMatch(GAME_NAME, { numPlayers: choice.numPlayers });
    console.log(res);
    matchId = res.matchID;
    console.log(matchId);
  } else if (choice.op == 'join') {
    matchId = choice.room;
    let match = await lobbyClient.getMatch(GAME_NAME, matchId);
    console.log('players', match.players);
    playerId = match.players.find(player => player.isConnected === undefined).id.toString();
    console.log('playerId', playerId);
  } else {
    console.error('Invalid choice');
  }
  
  if (choice.op == 'create' || choice.op == 'join') {
    new App(appElement, playerId, matchId);
  }
});
