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
    const cardIds = state.G.players[playerID];

    cardIds.forEach(cardId => {
      this.rootElement.appendChild(this.deck.getCardImageElem(cardId));
      this.rootElement.appendChild(document.createElement('span'));
    });
  } 
}