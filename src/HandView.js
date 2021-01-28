export class HandView {
  constructor(rootElement, client, deck) {
    this.rootElement = rootElement;
    this.client = client;
    this.deck = deck;
    console.log(this.deck);
    
    // Attach listeners
    document.onkeydown = (e) => {
      if (e.code === 'KeyQ') {
        this.client.moves.rotateLastCardInHand(-1);
      } else if (e.code === 'KeyE') {
        this.client.moves.rotateLastCardInHand(1);
      }
    }
  }

  getCards(state) {
    // TODO: refactor to avoid acessing state directly
    return state.G.players[this.client.playerID];
  }

  update(state) {
    if (state === null) {
        return;
    }

    this.rootElement.innerHTML = '';
    this.getCards(state).forEach(card => {
      const elem = this.deck.getCardImageElem(card.id);
      elem.style.transform = `rotate(${card.rotation * 90}deg)`;

      this.rootElement.appendChild(elem);
      this.rootElement.appendChild(document.createElement('span'));
    });
  } 
}