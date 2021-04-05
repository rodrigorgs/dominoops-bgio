import { INVALID_MOVE } from 'boardgame.io/core';
import { transform } from 'csv';
import createPanZoom from 'panzoom';
import { BOARD_HEIGHT, BOARD_WIDTH, CARD_HEIGHT, CARD_WIDTH } from './config';
import { Rules } from './Rules';
import { getCardAtBoardIndex, toastRed, updateCardRotationsOnServer } from './utils';

export class BoardView {
  constructor(rootElement, client, deck) {
    this.rootElement = rootElement;
    this.client = client;
    this.deck = deck;
    this.currentPlayer = undefined;
    this.lastCell = undefined;

    this.createBoard();
    this.createGhost();
    // this.attachListeners();

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
      let deltaTime;
      if (lastTimeStamp) {
        deltaTime = Math.min(timestamp - lastTimeStamp, 30.0);
      } else {
        deltaTime = 16.66;
      }
      lastTimeStamp = timestamp;

      this.panzoom.moveBy(dx * speed * deltaTime, dy * speed * deltaTime);
      if (dx != 0 || dy != 0) {
        window.requestAnimationFrame(performPan);
      }
    };
    const updateDxDy = () => {
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

    this.cardGhost = document.createElement('img');
    this.cardGhost.id = 'ghost';
    this.cardGhost.src = undefined;
    this.rootElement.querySelector('.board').appendChild(this.cardGhost);

    this.ghostZindex = 2;

    this.setGhostVisible(false);
    this.setGhostZindex(this.ghostZindex);

    document.addEventListener('keydown', e => {
      if (e.code === 'KeyF') {
        this.switchGhostZindex();
        this.updateCellBorder(this.lastCell);
      }
    });
  }

  switchGhostZindex() {
    this.setGhostZindex(-this.ghostZindex);
  }
  setGhostZindex(zindex) {
    this.ghostZindex = zindex;
    this.cardGhost.style.zIndex = 500 + zindex;
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
      <div class="board">d\n${cells.join('\n')}\n</div>
    `;
  }

  updateCellBorder(cell) {
    if (cell && !cell.hasChildNodes() && this.currentPlayer == this.client.playerID) {
      const validation = Rules.validateMove(this.client.getState().G, this.client.getState().ctx, cell.dataset.id, this.ghostZindex, this.selectedCard);
      const color = validation.success ? '#333' : 'red'
      cell.style.border = `dashed 1px ${color}`;
      this.lastCell = cell;
    }
  }

  attachListeners() {
    const handleCellClick = event => {
      if (!this.hasPanned && this.selectedCard) {
        const id = parseInt(event.target.dataset.id);
        updateCardRotationsOnServer(this.client);
        if (this.currentPlayer == this.client.playerID) {
          const ret = this.client.moves.clickCell(id, this.ghostZindex, { ...this.selectedCard });
          if (ret != INVALID_MOVE) {
            this.setGhostVisible(false);
            this.ghostZindex = 1 + Math.abs(this.ghostZindex);
          }
        } else {
          toastRed('Não está na sua vez!');
        }
      }
    };

    this.rootElement.onmousemove = e => {
      const transform = this.panzoom.getTransform();
      let x = (e.clientX - transform.x) / transform.scale;
      let y = (e.clientY - transform.y) / transform.scale;

      this.cardGhost.style.left = `${x - CARD_WIDTH / 4}px`;
      this.cardGhost.style.top = `${y - CARD_HEIGHT / 4}px`;
    }

    const cells = this.rootElement.querySelectorAll('.cell');
    let lastCell = undefined;
    cells.forEach(cell => {
      cell.onclick = handleCellClick;

      // draw border
      cell.onmouseover = event => {
        if (cell != this.lastCell) {
          this.updateCellBorder(cell);
        }
      };
      cell.onmouseout = event => {
        cell.style.border = 'none';
        this.lastCell = undefined;
      }

    });
  }

  update(state) {
    this.currentPlayer = state.ctx.currentPlayer;

    if (this.currentPlayer == this.client.playerID) {
      this.setGhostVisible(true);
      this.setGhostZindex(this.ghostZindex);
      this.attachListeners();
    } else {
      this.setGhostVisible(false);
    }

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
    this.cardGhost.style.display = visible ? 'block' : 'none';
  }

  onCardSelect(card) {
    const didChangeCard = card != this.selectedCard && this.cardGhost;
    this.selectedCard = card;
    this.cardGhost.style.transitionProperty = 'transform';

    this.cardGhost.style.transitionDuration = didChangeCard ? '0ms' : '300ms';

    if (card) {
      const newSrc = this.deck.getCardImageElem(card.id).src;
      if (this.cardGhost.src !== newSrc) {
        this.cardGhost.src = newSrc;
      }
      this.cardGhost.style.transform = `rotate(${card.rotation * 90}deg)`;
    } else {
      this.cardGhost.src = null;
    }

    this.updateCellBorder(this.lastCell);
  }
}
