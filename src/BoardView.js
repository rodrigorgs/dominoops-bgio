import { BOARD_HEIGHT, BOARD_WIDTH } from "./config";
import { getCardAtBoardIndex } from "./utils";

export class BoardView {
  constructor(rootElement, client, deck) {
    this.rootElement = rootElement;
    this.client = client;
    this.deck = deck;

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

    this.rootElement.innerHTML = `
      <table>${rows.join('')}</table>
      <p class="winner"></p>
    `;
  }

  attachListeners() {
    const handleCellClick = event => {
      if (!event.altKey) {
        const id = parseInt(event.target.dataset.id);
        this.client.moves.clickCell(id);
      }
    };
    
    const cells = this.rootElement.querySelectorAll('.cell');
    cells.forEach(cell => {
      cell.onclick = handleCellClick;
    });
  }

  update(state) {
    const cellElems = Array.from(document.querySelectorAll('.cell'));
    cellElems.forEach((cell, index) => {
      const card = getCardAtBoardIndex(this.client, index);
      cell.innerHTML = '';
      if (card !== null) {
        const elem = this.deck.getCardImageElem(card.id);
        elem.style.transform = `rotate(${card.rotation * 90}deg)`;
        cell.appendChild(elem);
      }
    });
  }
}