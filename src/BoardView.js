import { BOARD_HEIGHT, BOARD_WIDTH } from "./config";
import { getCardAtBoardIndex, getClientSelectedCard } from "./utils";

export class BoardView {
  constructor(rootElement, client, deck) {
    this.rootElement = rootElement;
    this.client = client;
    this.deck = deck;
    this.zindex = 0;
    
    this.invisibleElem = document.createElement('div');
    this.invisibleElem.style.visibility = 'none';

    this.cardGhost = document.createElement('img');
    this.cardGhost.width = 200;
    this.cardGhost.height = 200;
    this.cardGhost.style.opacity = 0.5;
    this.cardGhost.style.pointerEvents = 'none';

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

      // ghost card
      cell.onmouseover = (event) => {
        if (!cell.hasChildNodes()) {
          cell.appendChild(this.cardGhost);
        }
      }
    });

    const board = this.rootElement.querySelector('.board');
    board.onmouseout = (event) => {
      this.invisibleElem.innerHTML = '';
      this.invisibleElem.appendChild(this.cardGhost);
    }
  }

  update(state) {
    // update board
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
    
    // update selected card
    const selectedCard = getClientSelectedCard(this.client);
    if (selectedCard) {
      this.cardGhost.src = this.deck.getCardImageElem(selectedCard.id).src;
      this.cardGhost.style.transform = `rotate(${selectedCard.rotation * 90}deg)`;
    } else {
      this.cardGhost.src = null;
    }

    // ghost
    const hover = Array.from(document.querySelectorAll(':hover'));
    const hoverCells = hover.filter(e => e.className == 'cell');
    if (hoverCells.length == 1) {
      const cell = hoverCells[0];
      if (!cell.hasChildNodes()) {
        cell.appendChild(this.cardGhost);
      }
    }
  }
}