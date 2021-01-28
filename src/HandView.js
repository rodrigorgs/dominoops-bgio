export class HandView {
  constructor(rootElement, deck) {
    this.rootElement = rootElement;
    this.deck = deck;
    console.log(this.deck);
  }

  update(state, playerID) {
    if (state === null) {
        return;
    }

    this.rootElement.innerHTML = '';
    // TODO: refactor to avoid acessing state directly
    const cards = state.G.players[playerID];

    cards.forEach(card => {
      const elem = this.deck.getCardImageElem(card.id);
      elem.style.transform = `rotate(${card.rotation * 90}deg)`;
      
      this.rootElement.appendChild(elem);
      this.rootElement.appendChild(document.createElement('span'));
    });
  } 
}