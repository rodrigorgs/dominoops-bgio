import createPanZoom from 'panzoom';
import { BOARD_HEIGHT, BOARD_WIDTH } from './config';
import { getCardAtBoardIndex, toastRed, updateCardRotationsOnServer } from './utils';

export class BoardView {
  constructor(rootElement, client, deck) {
    this.rootElement = rootElement;
    this.client = client;
    this.deck = deck;
    this.currentPlayer = undefined;

    this.createBoard();
    this.attachListeners();
    this.createGhost();

    this.hasPanned = false;
    this.panzoom = createPanZoom(document.querySelector('.board'), {
      zoomDoubleClickSpeed: 1, // disable double click
      initialZoom: 1.0,
      maxZoom: 2.5,
      minZoom: 0.2,
      beforeMouseDown: e => {
        this.hasPanned = false;
        return false;
      },
    });
    this.panzoom.moveTo(0, -400);

    this.panzoom.on('panstart', () => (this.hasPanned = true));

    this.configureKeyboardPanning();
  }

  configureKeyboardPanning() {
    let dx = 0;
    let dy = 0;
    const speed = 8 / 16.0;
    const keyState = {KeyA: false, KeyS: false, KeyD: false, KeyW: false};

    let lastTimeStamp = undefined;
    const performPan = (timestamp) => {
      let deltaTime = 1;
      if (lastTimeStamp) {
        deltaTime = timestamp - lastTimeStamp;
      } else {
        deltaTime = 16.66;
      }
      lastTimeStamp = timestamp;

      console.log(timestamp)
      this.panzoom.moveBy(dx * speed * deltaTime, dy * speed * deltaTime);
      if (dx != 0 || dy != 0) {
        window.requestAnimationFrame(performPan);
      }
    };
    const updateDxDy = () => {
      console.log(1);
      dx = 0;
      dy = 0;
      if (keyState.KeyA) dx += 1;
      if (keyState.KeyD) dx -= 1;
      if (keyState.KeyS) dy -= 1;
      if (keyState.KeyW) dy += 1;

      if (dx != 0 || dy != 0) {
        window.requestAnimationFrame(performPan);
      } else {
        lastTimeStamp = undefined;
      }
    }

    document.addEventListener('keydown', e => {
      if (e.code in keyState) {
        keyState[e.code] = true;
      }
      updateDxDy();
    });
    document.addEventListener('keyup', e => {
      if (e.code in keyState) {
        keyState[e.code] = false;
      }
      updateDxDy();
    });
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

    document.addEventListener('keydown', e => {
      if (e.code === 'KeyF') {
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
        updateCardRotationsOnServer(this.client);
        if (this.currentPlayer == this.client.playerID) {
          this.client.moves.clickCell(id, this.ghostZindex, { ...this.selectedCard });
          this.ghostZindex = 1 + Math.abs(this.ghostZindex);
        } else {
          toastRed('Não está na sua vez!');
        }
      }
    };

    const cells = this.rootElement.querySelectorAll('.cell');
    cells.forEach(cell => {
      cell.onclick = handleCellClick;

      // move ghost card to cell
      cell.onmouseover = event => {
        if (!cell.hasChildNodes()) {
          cell.appendChild(this.cardGhost);
          this.setGhostZindex(this.ghostZindex);
        }
      };
    });

    const board = this.rootElement.querySelector('.board');
    board.onmouseout = event => {
      this.invisibleElem.innerHTML = '';
      this.invisibleElem.appendChild(this.cardGhost);
    };
  }

  update(state) {
    this.currentPlayer = state.ctx.currentPlayer;

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
        const dropShadows = [
          [4, 4],
          [4, -4],
          [-4, -4],
          [-4, 4],
        ];
        const dp = dropShadows[((card.rotation % 4) + 4) % 4];
        const filter = `drop-shadow(${dp[0]}px ${dp[1]}px 2px #333333)`;
        img.style.setProperty('filter', filter);

        img.style.border = ``;
        cell.appendChild(img);
      }
    });
  }

  setGhostVisible(visible) {
    if (this.currentPlayer != this.client.playerID) {
      visible = false;
    }
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
