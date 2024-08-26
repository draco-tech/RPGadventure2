class Npc {
  constructor(x, y, id) {
    this.position = {
      x: x,
      y: y,
    };
    this.id = id;
    this.width = 50;
    this.height = 50;
  }
  update() {
    this.position.y += 1;
  }
}

module.exports = Npc;
