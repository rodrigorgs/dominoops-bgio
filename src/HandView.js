import { getClientCards, getClientSelectedCardIndex } from "./utils";

export class HandView {
  constructor(rootElement, client, deck) {
    this.rootElement = rootElement;
    this.client = client;
    this.deck = deck;
    console.log(this.deck);

    this.rootElement.style.display = 'block';
    
    // Attach listeners
    document.addEventListener('keydown', (e) => {
      if (e.code === 'KeyQ') {
        this.client.moves.rotateSelectedCard(-1);
      } else if (e.code === 'KeyE') {
        this.client.moves.rotateSelectedCard(1);
      } else if (e.code === 'KeyZ') {
        this.client.moves.moveSelectedCardIndex(-1);
      } else if (e.code === 'KeyX') {
        this.client.moves.moveSelectedCardIndex(1);
      }
    });
  }

  update(state) {
    if (state === null) {
        return;
    }

    this.rootElement.innerHTML = '';
    const selectedCardIndex = getClientSelectedCardIndex(this.client);
    getClientCards(this.client).forEach((card, index) => {
      const elem = this.deck.getCardImageElem(card.id);
      elem.style.transform = `rotate(${card.rotation * 90}deg)`;
      if (index === selectedCardIndex) {
        elem.style.border = '2px solid red';
      } else {
        elem.style.border = '';
      }

      // attach listener
      elem.onclick = (event) => {
        this.client.moves.setSelectedCardIndex(index);
      }

      this.rootElement.appendChild(elem);
      this.rootElement.appendChild(document.createElement('span'));
    });
  } 
}