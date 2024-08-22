import { IDLE, RUNNING } from "./playerState";
import { checkForCollision, createObjectsFrom2D } from "./utils";
 

class MainCharacter {
  constructor({ position, isDev }) {
    this.isDev = isDev;
    this.scale = 1;
    this.x = position.x;
    this.y = position.y;
    this.sizeSprite = 42;
    this.sizeCollisionBlock = 26;
    this.width = this.sizeCollisionBlock;
    this.height = this.sizeCollisionBlock;
    this.speed = 2;
    this.mundo = null;
    this.velocity = {
      x: 0,
      y: 0,
    };
    this.sprite = new Image();
    this.sprite.src = "public/blueNinja/grogGreenAll.png";
    this.frameWidthLimit = 10;
    this.frameX = 0;
    this.frameY = 0;
    this.frameWidth = 32;
    this.frameHeight = 32;
    this.frameTime = 0;
    this.maxFrame = 5;
    this.fps = 14;
    this.frameInterval = 1000 / this.fps;
    this.collisionBlocks = [];
  }
  update(c, deltaTime) {
    this.checkCanvasBoundaries();
    this.playerIsMoved();

    //sprrite animation
    if (this.frameTime > this.frameInterval) {
      this.frameTime = 0;
      if (this.frameX < this.maxFrame) this.frameX++;
      else this.frameX = 0;
    } else this.frameTime += deltaTime;

    this.draw(c);
    if (this.mundo !== null) {

      this.collisionBlocks = createObjectsFrom2D(this.mundo.collectionBlocks);
      this.checkCollisionsBlocksHorizontal();
      this.checkCollisionsBlocksVertical();
    }
  }
  draw(c) {
    c.fillStyle = "#00000030";
    c.beginPath();
    c.ellipse(
      this.x + this.width / 2,
      this.y + this.height,
      this.width / 3,
      this.height / 6,
      0,
      0,
      Math.PI * 2
    );
    c.fill();

    c.drawImage(
      this.sprite,
      this.frameX * this.frameWidth,
      this.frameY * this.frameHeight,
      this.frameWidth,
      this.frameHeight,
      this.x - this.sizeSprite / 5,
      this.y - this.sizeSprite / 5 - 8,
      this.sizeSprite,
      this.sizeSprite
    );
    if (this.isDev) {
      c.fillStyle = "#f000ff50";
      c.fillRect(this.x, this.y, this.width, this.height);
    }
  }
  playerIsMoved() {
    this.x += this.velocity.x;
    this.y += this.velocity.y;
  }
  checkCanvasBoundaries() {
    if (this.mundo !== null) {
      if (this.x >= this.mundo.w - this.width) {
        this.x = this.mundo.w - this.width;
      } else if (this.x <= 0) {
        this.x = 0;
      }
      if (this.y >= this.mundo.h - this.height) {
        this.y = this.mundo.h - this.height;
      } else if (this.y <= 0) {
        this.y = 0;
      }
    }
  }
  checkCollisionsBlocksHorizontal() {
    for (let i = 0; i < this.collisionBlocks.length; i++) {
      const collisionBlock = this.collisionBlocks[i];

      if (checkForCollision({ object1: this, object2: collisionBlock })) {
        if (this.velocity.x > 0) {
          // Moviendo hacia la derecha
          this.velocity.x = 0;
          this.x = collisionBlock.position.x - this.width - 1; // Ajuste de posición para alinearse correctamente al borde del bloque
        }
        if (this.velocity.x < 0) {
          // Moviendo hacia la izquierda
          this.velocity.x = 0;

          this.x = collisionBlock.position.x + collisionBlock.width + 1; // Ajuste de posición para alinearse correctamente al borde del bloque
        }
      }
    }
  }
  checkCollisionsBlocksVertical() {
    for (let i = 0; i < this.collisionBlocks.length; i++) {
      const collisionBlock = this.collisionBlocks[i];

      if (checkForCollision({ object1: this, object2: collisionBlock })) {
        if (this.velocity.y > 0) {
          // Moviendo hacia abajo
          this.velocity.y = 0;
          this.y = collisionBlock.position.y - this.height; // Ajuste de posición para alinearse correctamente al borde del bloque
        } else if (this.velocity.y < 0) {
          // Moviendo hacia arriba
          this.velocity.y = 0;
          this.y = collisionBlock.position.y + collisionBlock.height; // Ajuste de posición para alinearse correctamente al borde del bloque
        }
      }
    }
  }
}

class Player extends MainCharacter {
  constructor({ position, isDev, mundo }) {
    super({ position, isDev, mundo });

    this.camera = {
      x: this.x,
      y: this.y,
      w: 300,
      h: 300,
      isFollowing: true,
      moveX: 0,
      moveY: 0,
    };
    this.keyPress = false;
    this.mundo = mundo;
    this.states = [new IDLE(this), new RUNNING(this)];
    this.indexState = 0;
    this.currentState = this.states[this.indexState];
    this.lastDercion = "";
  }

  update({ c, deltaTime, canvas }) {
    super.update(c, deltaTime);
    this.input();

    this.updateCamera({ c, canvas });

    if (this.isDev) {
      this.paintStates({c , msj:this.currentState.state, x:this.x-5, y:this.y-10});
    }
  }
  paintStates({c, msj, x, y}) {
    c.font = "16px Arial"; // Tamaño y fuente del texto
    c.fillStyle = "blue"; // Color del texto

    // Escribir el texto en el canvas
    c.fillText(msj, x,y); // Texto, posición x, posición y

    // Opcional: añadir bordes al texto
    c.strokeStyle = "black"; // Color del borde
    c.lineWidth = 1; // Ancho del borde
    c.strokeText(msj, x,y); // Texto, posición x, posición y
  }

  updateCamera({ c, canvas }) {
    if (this.isDev) {
      c.fillStyle = "#0ff00040";
      c.fillRect(this.camera.x, this.camera.y, this.camera.w, this.camera.h);
    }
    //!player is on the top
    this.shouldPanCameraUp();
    // !player is on the left

    this.shouldPanCameraToTheLeft({ canvas });
    // !player is on the right

    this.shouldPanCameraToTheRight({ canvas });

    // !player is on the bottom

    this.shouldPanCameraDown({ canvas });

    if (this.camera.isFollowing) {
      this.camera.x = this.x - this.camera.w / 2 + this.width / 2;
      this.camera.y = this.y - this.camera.h / 2 + this.height / 2;
    }
  }
  shouldPanCameraToTheLeft({ canvas }) {
    // Calcula el ancho movido basado en la posición actual de la cámara
    const movedWidth = Math.abs(this.camera.moveX);

    // Si el jugador se mueve hacia la derecha, salir de la función
    if (this.velocity.x >= 0) return;

    // Verifica si la cámara ha alcanzado el límite izquierdo visible
    if (this.camera.x <= movedWidth) {
      // Solo mueve la cámara si aún hay espacio en el mundo para moverse hacia la izquierda
      if (movedWidth > 0) {
        this.camera.moveX -= this.velocity.x; // Mueve la cámara en la dirección opuesta
      }
    }

    // camera.position.x -= this.velocity.x
  }

  shouldPanCameraToTheRight({ canvas }) {
    const movedWidth = canvas.width + Math.abs(this.camera.moveX);

    if (this.velocity.x <= 0) return;

    if (this.camera.x + this.camera.w >= movedWidth) {
      if (movedWidth < this.mundo.w) {
        this.camera.moveX -= this.velocity.x;
      }
    }
  }
  shouldPanCameraUp() {
    const movedHeight = Math.abs(this.camera.moveY);

    // Si el jugador se mueve hacia abajo, salir de la función
    if (this.velocity.y >= 0) return;

    // Verifica si la cámara ha alcanzado el límite superior visible
    if (this.camera.y <= movedHeight) {
      // Solo mueve la cámara si aún hay espacio en el mundo para moverse hacia arriba
      if (movedHeight > 0) {
        this.camera.moveY -= this.velocity.y; // Mueve la cámara hacia arriba
      }
    }
  }
  shouldPanCameraDown({ canvas }) {
    const movedHeight = canvas.height + Math.abs(this.camera.moveY);

    // Si el jugador se mueve hacia arriba, salir de la función
    if (this.velocity.y <= 0) return;

    // Verifica si la cámara ha alcanzado el límite inferior visible
    if (this.camera.y + this.camera.h >= movedHeight) {
      // Solo mueve la cámara si aún hay espacio en el mundo para moverse hacia abajo
      if (movedHeight < this.mundo.h) {
        this.camera.moveY -= this.velocity.y; // Mueve la cámara hacia abajo
      }
    }
  }

  input() {
    document.addEventListener("keydown", (event) => {
      this.currentState.handleKeyDown(event);

      this.keyPress = true;
    });
    document.addEventListener("keyup", (event) => {
      this.currentState.handleKeyUp(event);
      this.keyPress = false;
    });
  }
}

export default Player;
