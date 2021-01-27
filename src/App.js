import { Client } from 'boardgame.io/client';
import { Game } from './Game';

class App {
  constructor(rootElement) {
    this.client = Client({ game: Game });
    this.client.start();
    this.client.subscribe(state => this.update(state));

    this.rootElement = rootElement;
    this.createBoard();
    this.attachListeners();
  }

  createBoard() {
    const rows = [];
    for (let i = 0; i < 3; i++) {
      const cells = [];
      for (let j = 0; j < 3; j++) {
        const id = 3 * i + j;
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
    const cellElems = Array.from(document.querySelectorAll('.cell'));
    if (cellElems.length > 0) {
      for (let y = 0; y < 3; y++) {
        for (let x = 0; x < 3; x++) {
          const index = x + (y * 3);
          cellElems[index].innerHTML = state.G.cells[index];
        }
      }
    }
  }
}

const appElement = document.getElementById('app');
const app = new App(appElement);