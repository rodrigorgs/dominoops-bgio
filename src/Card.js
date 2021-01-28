export class Card {
  constructor(id, rotation) {
    this.id = id;
    this.rotation = rotation;
  }

  rotate(times) {
    this.rotation = (this.rotation + 4 + times) % 4;
  }
}