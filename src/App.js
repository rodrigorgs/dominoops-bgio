import { SocketIO } from 'boardgame.io/multiplayer'
import { Client } from 'boardgame.io/client';
import { Game, BOARD_WIDTH, BOARD_HEIGHT } from './Game';
class App {
  constructor(rootElement, playerId) {
    this.client = Client({
      game: Game,
      // multiplayer: SocketIO({ server: 'localhost:8000' }),
      multiplayer: SocketIO({ server: 'https://dominoops.herokuapp.com/' }),
      playerID: playerId
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
      const id = parseInt(event.target.dataset.id);
      this.client.moves.clickCell(id);
    };
    // Attach the event listener to each of the board cells.
    const cells = this.rootElement.querySelectorAll('.cell');
    cells.forEach(cell => {
      cell.onclick = handleCellClick;
    });
  }

  update(state) {
    if (state === null) return;

    const cellElems = Array.from(document.querySelectorAll('.cell'));
    if (cellElems.length > 0) {
      for (let y = 0; y < BOARD_HEIGHT; y++) {
        for (let x = 0; x < BOARD_WIDTH; x++) {
          const index = x + (y * BOARD_WIDTH);
          const id = state.G.cells[index];
          // cellElems[index].innerHTML = id;
          if (id !== null) {
            this.putCard(id * 10, x, y);
          }
        }
      }
    }

    let elem = document.createElement('p');
    elem.innerText = 'current player: ' + state.ctx.currentPlayer;
    document.getElementById('app').appendChild(elem);
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
    const CARD_OUTPUT_SIZE = 100;

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

let url = new URL(location.href);
let playerId = url.searchParams.get("player") || null;
console.log('playerId: ', playerId);

const appElement = document.getElementById('app');
const app = new App(appElement, playerId);