class Npc {
  constructor(x, y, id) {
    this.position = {
      x: x,
      y: y,
    };
    this.id = id;
    this.width = 50;
    this.height = 50;
    this.colissionBlock = [];
    this.velocity = {
      x: 0,
      y: 0,
    };
    this.velocity.x = 1;
  }
  update(deltaTime) {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    this.checkCollisionsBlocksHorizontal(this.colissionBlock);

    this.checkCollisionsBlocksVertical(this.colissionBlock);
  }

  checkCollisionsBlocksHorizontal(blockes) {
    for (let i = 0; i < blockes.length; i++) {
      const collisionBlock = blockes[i];
      console.log("collisionBlock", collisionBlock);

      if (checkForCollision({ object1: this, object2: collisionBlock })) {
        if (this.velocity.x > 0) {
          // Moviendo hacia la derecha

          // if is player do somethig here but If is NPC do somethig else here
          this.onCollicioBlockHorizontalRight(collisionBlock);
        }
        if (this.velocity.x < 0) {
          // Moviendo hacia la izquierda
          this.onCollicioBlockHorizontalLeft(collisionBlock);
        }
      }
    }
  }
  checkCollisionsBlocksVertical(blockes) {
    for (let i = 0; i < blockes.length; i++) {
      const collisionBlock = blockes[i];

      if (checkForCollision({ object1: this, object2: collisionBlock })) {
        if (this.velocity.y > 0) {
          // Moviendo hacia abajo

          this.onCollicioBlockVerticalTop(collisionBlock);
        } else if (this.velocity.y < 0) {
          // Moviendo hacia arriba
          this.onCollicioBlockVerticalBottom(collisionBlock);
        }
      }
    }
  }

  onCollicioBlockHorizontalLeft(collisionBlock) {
    this.velocity.x = 0;
    this.position.x = collisionBlock.position.x + collisionBlock.width + 2;
    // this.velocity.x = this.velocity.y > 0 ? this.speed : -this.speed; // Invertir la dirección en el eje X
    // this.position.x = collisionBlock.position.x - this.width - 1; // Ajuste de posición
  }
  onCollicioBlockHorizontalRight(collisionBlock) {
    this.velocity.x = 0;
    // this.position.x = collisionBlock.position.x - this.width - 2; // Ajuste de posición para alinearse correctamente al borde del bloque

    setTimeout(() => {
      this.velocity.x = this.velocity.y > 0 ? this.speed : -this.speed; // Invertir la dirección en el eje X
    }, 10);

    // this.position.x = collisionBlock.position.x - this.width - 1; // Ajuste de posición
  }
  onCollicioBlockVerticalTop(collisionBlock) {
    this.velocity.y = 0;
    this.position.y = collisionBlock.position.y - this.height - 2; // Ajuste de posición para alinearse correctamente al borde del bloque

    // this.velocity.y = -this.speed; // Invertir la dirección en el eje Y
    // this.position.y = collisionBlock.position.y + collisionBlock.height + 1;
  }
  onCollicioBlockVerticalBottom(collisionBlock) {
    this.velocity.y = 0;
    this.position.y = collisionBlock.position.y + collisionBlock.height + 2; // Ajuste de posición para alinearse correctamente al borde del bloque

    // this.velocity.y = this.speed; // Invertir la dirección en el eje Y
    // this.position.y = collisionBlock.position.y - this.height - 1;
  }
}

function checkForCollision({ object1, object2 }) {
  console.log("object1", object1);

  return (
    object1.position.y + object1.height > object2.position.y &&
    object1.position.y < object2.position.y + object2.height &&
    object1.position.x + object1.width > object2.position.x &&
    object1.position.x < object2.position.x + object2.width
  );
}

module.exports = Npc;
