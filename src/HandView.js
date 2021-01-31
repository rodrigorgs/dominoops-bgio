import { getClientCards, getClientSelectedCard, getClientSelectedCardIndex, getClientPlayer } from "./utils";

export class HandView {
  constructor(rootElement, client, deck, selectionHandler) {
    this.rootElement = rootElement;
    this.client = client;
    this.deck = deck;
    this.selectionHandler = selectionHandler;

    this.selectedCardIndex = 0;

    this.rootElement.style.display = 'block';
    
    // Attach listeners
    document.addEventListener('keydown', (e) => {
      const card = this.getSelectedCard();
      if (card !== null) {
        if (e.code === 'KeyQ') {
          card.rotation--;
          this.updateCardTransform(card);
        } else if (e.code === 'KeyE') {
          card.rotation++;
          this.updateCardTransform(card);
        }
      }
    });
  }

  getSelectedCard() {
    const cards = getClientCards(this.client);
    if (this.selectedCardIndex >= 0 && this.selectedCardIndex < cards.length) {
      return cards[this.selectedCardIndex];
    } else {
      return null;
    }
  }

  updateCardTransform(card) {
    if (!card) {
      return null;
    }

    const elem = this.deck.getCardImageElem(card.id);
    elem.style.transform = `rotate(${card.rotation * 90}deg)`;
    if (this.selectionHandler) {
      this.selectionHandler(card);
    }
    return elem;
  }

  highlightSelectedCard() {
    const cards = getClientCards(this.client);
    if (this.selectedCardIndex >= 0 && this.selectedCardIndex < cards.length) {
      document.querySelectorAll('#hand img').forEach((elem, index) => {
        elem.style.border = (index === this.selectedCardIndex) ? '2px solid red' : '';
      });
    }
  }

  update(state) {
    if (state === null) {
        return;
    }

    this.rootElement.innerHTML = '';
    const cards = getClientCards(this.client);
    cards.forEach((card, index) => {
      const elem = this.updateCardTransform(card);

      // attach listener
      elem.onclick = (event) => {
        this.selectedCardIndex = index;
        this.highlightSelectedCard();
        if (this.selectionHandler) {
          this.selectionHandler(getClientCards(this.client)[index]);
        }
      }

      this.rootElement.appendChild(elem);
      this.rootElement.appendChild(document.createElement('span'));
    });

    if (this.selectedCardIndex < 0 || this.selectedCardIndex >= cards.length) {
      this.selectedCardIndex = 0;
    }
    this.highlightSelectedCard();
    this.selectionHandler(this.getSelectedCard());
  } 
}