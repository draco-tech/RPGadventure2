import {
  checkForCollision,
  createObjectsFrom2D,
  detectCollisionCircle,
  detectCollisionCircleAttack,
} from "./utils";

class MainCharacter {
  constructor({ position, isDev, allstates = [], tag = "unknows" }) {
    this.isDev = isDev;
    this.scale = 1;
    this.position = {
      x: position?.x || 164,
      y: position?.y || 164,
    };
    this.tag = tag;
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
    this.states = allstates.map((state) => new state(this));
    this.indexState = 0;
    this.currentState = this.states[this.indexState];
    this.lastDercion = "";
    this.incialFrameX = 0;
    this.frameX = this.incialFrameX;
    this.frameY = 0;
    this.flipToLeft = false;
    this.frameWidthLimit = 10;
    this.frameWidth = 32;
    this.frameHeight = 32;
    this.maxFrame = 10;
    this.frameTime = 0;
    this.fps = 14;
    this.timeOfInterval = 1000;
    this.frameInterval = this.timeOfInterval / this.fps;
    this.collisionBlocks = [];
    this.radius = 15;
    this.attackRadio = 15;
    this.isDead = false;
    this.damageMessage = null;
    this.damageStartTime = null;
    this.currentState.enter();

    this.life = 5;
    this.heartImage = new Image();
    this.heartImage.src = "/hearts.png";
  }

  update(c, deltaTime, entities) {
    this.showDamage(c);
    this.checkCanvasBoundaries();
    this.playerIsMoved();
    this.checkEntetiesCollisions(entities);
    this.drawSprite(c, deltaTime);

    this.draw(c);
    if (this.velocity.x < -1) {
      this.flipToLeft = true;
    } else if (this.velocity.x > 1) {
      this.flipToLeft = false;
    }

    if (this.mundo) {
      // console.log('this.mundo.entities',this.mundo.entities);

      this.collisionBlocks = this.mundo.collectionBlocks; //, ...this.mundo.entities]

      this.checkCollisionsBlocksHorizontal(this.collisionBlocks);
      this.checkCollisionsBlocksVertical(this.collisionBlocks);
    }
  }
  checkEntetiesCollisions(entities) {
    // Verificar colisiones con otras entidades
    entities?.forEach((other) => {
      if (other !== this) {
        // this.checkCollisionsBlocksHorizontal([other]);
        // this.checkCollisionsBlocksVertical([other]);

        if (other.tag !== this.tag && detectCollisionCircle(this, other)) {
          this.onCollision(other);
          if (detectCollisionCircleAttack(this, other)) {
            this.onCollisionForAttack(other);
          } else {
          }
        } else {
          this.releaseCollision(other);
          this.releaseCollisionForAttack();
        }
      }
    });
  }
  paintLive(c, x, y) {
    for (let i = 0; i < this.life; i++) {
      c.drawImage(
        this.heartImage,
        x - 20 + i * 24 || this.position.x - 20 + i * 14,
        y || this.position.y + 32,
        x ? 20 : 12,
        x ? 20 : 12
      );
    }
  }
  draw(c) {
    c.fillStyle = "#00000030";
    c.beginPath();
    c.ellipse(
      this.position.x + this.width / 2,
      this.position.y + this.height,
      this.width / 3,
      this.height / 6,
      0,
      0,
      Math.PI * 2
    );
    c.fill();

    if (this.isDev) {
      c.fillStyle = "#f000ff50";
      c.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
  }
  drawSprite(c, deltaTime) {
    //sprrite animation
    if (this.frameTime > this.frameInterval) {
      this.frameTime = 0;
      if (this.frameX < this.maxFrame) this.frameX++;
      else this.frameX = this.incialFrameX;
    } else this.frameTime += deltaTime;
    c.save(); // Guardar el estado actual del contexto
    // Invertir el eje X si `flipToLeft` es verdadero this.flipToLeft ||
    let shouldFlip = this.flipToLeft;
    c.scale(shouldFlip ? -1 : 1, 1); // Invertir el eje X si `flipToLeft` es verdadero
    // Ajustar la posición en X para que la imagen se pinte correctamente si está invertida
    c.drawImage(
      this.sprite,
      this.frameX * this.frameWidth,
      this.frameY * this.frameHeight,
      this.frameWidth,
      this.frameHeight,
      shouldFlip
        ? -(this.position.x + this.sizeSprite) + this.sizeSprite / 5 // Ajuste para cuando se invierte
        : this.position.x - this.sizeSprite / 5, // Posición normal
      this.position.y - this.sizeSprite / 5 - 8,
      this.sizeSprite,
      this.sizeSprite
    );

    c.restore(); // Restaurar el estado del contexto
  }
  reciveDamage() {
    this.damageMessage = {
      text: "hit",
      startX: this.position.x + this.width / 2,
      startY: this.position.y - 5,
      alpha: 1, // Opacidad inicial
      yOffset: 0, // Desplazamiento en Y
    };

    this.damageStartTime = performance.now(); // Marca de tiempo inicial
  }

  showDamage(c) {
    // Si hay un mensaje de daño que mostrar
    if (this.damageMessage) {
      const elapsed = performance.now() - this.damageStartTime;
      const duration = 1000; // Duración de la animación en milisegundos
      const progress = elapsed / duration; // Progreso de la animación (0 a 1)

      // Actualiza el desplazamiento y la opacidad basados en el progreso
      if (progress < 1) {
        this.damageMessage.yOffset = progress * 30; // El mensaje sube 30 píxeles
        this.damageMessage.alpha = 1 - progress; // Desaparece gradualmente
      } else {
        // Finaliza la animación
        this.damageMessage = null;
      }

      // Dibuja el mensaje con la opacidad y el desplazamiento actuales
      if (this.damageMessage) {
        c.save();
        c.globalAlpha = this.damageMessage.alpha;
        c.fillStyle = "red"; // Puedes cambiar el estilo del texto
        c.font = "24px Arial"; // Ajusta el estilo de la fuente
        c.fillText(
          this.damageMessage.text,
          this.damageMessage.startX,
          this.damageMessage.startY - this.damageMessage.yOffset
        );

        c.restore();
      }
    }
  }

  paintStates({ c, msj, x, y }) {
    c.font = "16px Arial"; // Tamaño y fuente del texto
    c.fillStyle = "blue"; // Color del texto

    // Escribir el texto en el canvas
    c.fillText(msj, x, y); // Texto, posición x, posición y

    // Opcional: añadir bordes al texto
    c.strokeStyle = "black"; // Color del borde
    c.lineWidth = 1; // Ancho del borde
    c.strokeText(msj, x, y); // Texto, posición x, posición y
  }
  playerIsMoved() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }

  checkCanvasBoundaries() {
    if (this.mundo) {
      if (this.position.x >= this.mundo.w - this.width) {
        this.position.x = this.mundo.w - this.width;
        this.onCollisionCanvasHorizontal();
      } else if (this.position.x <= 0) {
        this.position.x = 0;
        this.onCollisionCanvasHorizontal();
      }
      if (this.position.y >= this.mundo.h - this.height) {
        this.position.y = this.mundo.h - this.height;
        this.onCollisionCanvasVertical();
      } else if (this.position.y <= 0) {
        this.position.y = 0;
        this.onCollisionCanvasVertical();
      }
    }
  }
  onCollicioBlockHorizontalLeft(collisionBlock) {
    this.velocity.x = 0;
    this.position.x = collisionBlock.position.x + collisionBlock.width + 2; // Ajuste de posición para alinearse correctamente al borde del bloque
  }
  onCollicioBlockHorizontalRight(collisionBlock) {
    this.velocity.x = 0;
    this.position.x = collisionBlock.position.x - this.width - 2; // Ajuste de posición para alinearse correctamente al borde del bloque
  }
  onCollicioBlockVerticalTop(collisionBlock) {
    this.velocity.y = 0;
    this.position.y = collisionBlock.position.y - this.height - 2; // Ajuste de posición para alinearse correctamente al borde del bloque
  }
  onCollicioBlockVerticalBottom(collisionBlock) {
    this.velocity.y = 0;
    this.position.y = collisionBlock.position.y + collisionBlock.height + 2; // Ajuste de posición para alinearse correctamente al borde del bloque
  }

  checkCollisionsBlocksHorizontal(blockes) {
    for (let i = 0; i < blockes.length; i++) {
      const collisionBlock = blockes[i];

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
  drawZone(c) {
    // Radio del círculo
    //this.attackRadio
    // Dibujar el círculo
    c.beginPath();
    c.arc(
      this.position.x + this.width / 2,
      this.position.y + this.height / 2,
      this.radius,
      0,
      Math.PI * 2,
      false
    ); // Dibuja el círculo completo
    c.fillStyle = "#9b650030"; // Color del círculo
    c.fill(); // Rellena el círculo
    c.strokeStyle = "black"; // Color del borde
    c.stroke(); // Dibuja el borde del círculo

    c.beginPath();
    c.arc(
      this.position.x + this.width / 2,
      this.position.y + this.height / 2,
      this.attackRadio,
      0,
      Math.PI * 2,
      false
    ); // Dibuja el círculo completo
    c.fillStyle = "#ff000060"; // Color del círculo
    c.fill(); // Rellena el círculo
    c.strokeStyle = "black"; // Color del borde
    c.stroke(); // Dibuja el borde del círculo
  }
  onCollision(other) {}
  releaseCollision(other) {}
  onCollisionCanvasHorizontal() {}
  onCollisionCanvasVertical() {}
  turnFlipSprite() {}
  onCollisionForAttack(other) {}
  releaseCollisionForAttack() {}
}

export default MainCharacter;
