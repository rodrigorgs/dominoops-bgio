export class Deck {
  constructor(deckImgElem, numCards, cardWidth, cardHeight, nCols) {
    this.numCards = numCards;
    this.imageData = Array(numCards);
    this.imageElems = Array(numCards);

    const canvas = document.createElement('canvas');
    canvas.width = cardWidth;
    canvas.height = cardHeight;
    const ctx = canvas.getContext('2d');

    for (let id = 0; id < numCards; id++) {
      const y = Math.floor(id / nCols);
      const x = id % nCols;
      ctx.beginPath();
      ctx.drawImage(deckImgElem, x * cardWidth, y * cardHeight, cardWidth, cardHeight, 0, 0, cardWidth, cardHeight);
      ctx.fill();
  
      const imageData = canvas.toDataURL('image/png');
      this.imageData[id] = imageData;

      const imageElem = document.createElement('img');
      imageElem.src = imageData;
      this.imageElems[id] = imageElem;
    }
  }

  getCardImageElem(id) {
    return this.imageElems[id];
  }
}