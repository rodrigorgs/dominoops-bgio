import createPanZoom from "panzoom";
import { BOARD_HEIGHT, BOARD_WIDTH } from "./config";
import { getCardAtBoardIndex, getClientCards, getClientSelectedCard } from "./utils";

export class BoardView {
  constructor(rootElement, client, deck) {
    this.rootElement = rootElement;
    this.client = client;
    this.deck = deck;

    this.createBoard();
    this.attachListeners();    
    this.createGhost();

    this.hasPanned = false;
    const panzoom = createPanZoom(document.querySelector('.board'), {
      zoomDoubleClickSpeed: 1, // disable double click
      initialX: -300,
      initialY: -300,
      initialZoom: 0.5,
      beforeMouseDown: (e) => {
        this.hasPanned = false;
        return false;
      }
    });

    panzoom.on('panstart', () => this.hasPanned = true);
  }

  createGhost() {
    this.selectedCard = null;

    this.invisibleElem = document.createElement('div');
    this.invisibleElem.style.display = 'none';

    this.cardGhost = document.createElement('img');
    this.cardGhost.id = 'ghost';
    this.cardGhost.src = undefined;
    this.invisibleElem.appendChild(this.cardGhost);
    
    this.ghostZindex = 2;

    this.setGhostVisible(false);

    document.addEventListener('keydown', (e) => {
      if (e.code === 'KeyW') {
        this.switchGhostZindex();
      }
    });
  }

  switchGhostZindex() {
    this.setGhostZindex(-this.ghostZindex);
  }
  setGhostZindex(zindex) {
    this.ghostZindex = zindex;
    if (this.cardGhost && this.cardGhost.parentElement.className == 'cell') {
      this.cardGhost.parentElement.style.zIndex = 500 + zindex;
    }
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
      if (!this.hasPanned && this.selectedCard) {
        const id = parseInt(event.target.dataset.id);
        const rotations = getClientCards(this.client).map(card => card.rotation);
        this.client.moves.setPlayerCardRotations(rotations);
        this.client.moves.clickCell(id, this.ghostZindex, { ...this.selectedCard });
        this.ghostZindex = 1 + Math.abs(this.ghostZindex);
      }
    };
    
    const cells = this.rootElement.querySelectorAll('.cell');
    cells.forEach(cell => {
      cell.onclick = handleCellClick;

      // move ghost card to cell
      cell.onmouseover = (event) => {
        if (!cell.hasChildNodes()) {
          cell.appendChild(this.cardGhost);
          this.setGhostZindex(this.ghostZindex);
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
        cell.style.zIndex = 500 + card.zIndex;
        const img = this.deck.getCardImageElem(card.id);
        // rotation
        img.style.transform = `rotate(${(card.rotation % 4) * 90}deg)`;
        
        // drop shadow
        const dropShadows = [[4, 4], [4, -4], [-4, -4], [-4, 4]];
        const dp = dropShadows[((card.rotation % 4) + 4) % 4];
        const filter = `drop-shadow(${dp[0]}px ${dp[1]}px 2px #333333)`;
        img.style.setProperty('filter', filter);

        img.style.border = ``;
        cell.appendChild(img);
      }
    });
  }

  setGhostVisible(visible) {
    this.cardGhost.style.display = visible ? 'block' : 'none';
  }

  onCardSelect(card) {
    this.selectedCard = card;
    if (card) {
      const newSrc = this.deck.getCardImageElem(card.id).src;
      if (this.cardGhost.src !== newSrc) {
        this.cardGhost.src = newSrc;
      }
      this.cardGhost.style.transform = `rotate(${card.rotation * 90}deg)`;
      this.setGhostVisible(true);
    } else {
      this.cardGhost.src = null;
      this.setGhostVisible(false);
    }
  }
}