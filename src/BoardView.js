import { BOARD_HEIGHT, BOARD_WIDTH } from "./config";
import { getCardAtBoardIndex } from "./utils";

export class BoardView {
  constructor(rootElement, client, deck) {
    this.rootElement = rootElement;
    this.client = client;
    this.deck = deck;
    this.zindex = 0;

    this.createBoard();
    this.attachListeners();    
  }

  createBoard() {
    let id = 0;
    let cells = [];
    for (let i = 0; i < BOARD_HEIGHT; i++) {
      for (let j = 0; j < BOARD_WIDTH; j++) {
        cells.push(`<div class="cell" data-id="${id}"></div>`);
        id++;
      }
    }

    this.rootElement.innerHTML = `
      <div class="board">\n${cells.join('\n')}\n</div>
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
        cell.style.zIndex = card.zIndex;
        const img = this.deck.getCardImageElem(card.id);
        img.style.transform = `rotate(${card.rotation * 90}deg)`;
        img.style.border = ``;
        cell.appendChild(img);
      }
    });
  }
}