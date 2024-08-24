import { NPC_CHASE, NPC_IDLE, NPC_PATROL, npcStates } from "./npc/npcState";
import { changeState } from "./playerState";
import {
  checkForCollision,
  createObjectsFrom2D,
  detectCollisionCircle,
} from "./utils";

class MainCharacter {
  constructor({ position, isDev, allstates = [], tag = "unknows" }) {
    this.isDev = isDev;
    this.scale = 1;
    this.position = {
      x: position.x,
      y: position.y,
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
    this.frameX = 0;
    this.frameY = 0;
    this.flipToLeft = false;
    this.frameWidthLimit = 10;
    this.frameWidth = 32;
    this.frameHeight = 32;
    this.maxFrame = 5;
    this.frameTime = 0;
    this.fps = 14;
    this.timeOfInterval = 1000;
    this.frameInterval = this.timeOfInterval  / this.fps;
    this.collisionBlocks = [];
    this.radius = 15;
  }
  update(c, deltaTime, entities) {
    this.checkCanvasBoundaries();
    this.playerIsMoved();
    this.checkEntetiesCollisions(entities);
    this.drawSprite(c,deltaTime)

    this.draw(c);
    if (this.velocity.x < -1) {
      this.flipToLeft = true;
    } else if (this.velocity.x > 1) {
      this.flipToLeft = false;
    }

    if (this.mundo) {
      // console.log('this.mundo.entities',this.mundo.entities);

      this.collisionBlocks = createObjectsFrom2D(this.mundo.collectionBlocks); //, ...this.mundo.entities]

      this.checkCollisionsBlocksHorizontal(this.collisionBlocks);
      this.checkCollisionsBlocksVertical(this.collisionBlocks);
    }
  }
  checkEntetiesCollisions(entities) {
    // Verificar colisiones con otras entidades
    entities?.forEach((other) => {
      if (other !== this) {
        this.checkCollisionsBlocksHorizontal([other]);
        this.checkCollisionsBlocksVertical([other]);
        if (detectCollisionCircle(this, other)) {
          this.onCollision(other);
        }else{
          this.releaseCollision(other);
        }
      }

      
    });
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
  drawSprite(c,deltaTime) {
    //sprrite animation
    if (this.frameTime > this.frameInterval) {
      this.frameTime = 0;
      if (this.frameX < this.maxFrame) this.frameX++;
      else this.frameX = 0;
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
  onCollisionCanvasHorizontal() {}
  onCollisionCanvasVertical() {}
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
  }
  onCollision(other) {
    // if (this.isDev) {console.log(`Colisión entre ${this.tag} y ${other.tag}`)}
    // Manejar la colisión de alguna manera
  }
  releaseCollision(other){

  }
}

export default MainCharacter;

export class NPC extends MainCharacter {
  constructor({
    position,
    img = "public/blueNinja/ninjaBluAll.png",
    frameWidth = 32,
    frameHeight = 32,
    maxFrame = 5,
    allstates = [NPC_IDLE, NPC_PATROL, NPC_CHASE]  ,
  }) {
    super({
      position,
      allstates,
    });
    this.sprite.src = img;
    this.velocity.x = 0;
    this.velocity.y = 0;
    this.frameWidth = frameWidth;
    this.frameHeight = frameHeight;
    this.maxFrame = maxFrame;

    this.fps = 2;
    this.radius = 50;
    this.tag = "enemy";
    this.speed = 2;
    this.currentState.enter();
    this.isDev = false;
  }

  update(c, deltaTime, entities) {
    if (this.velocity.x > 1) {
      this.flipToLeft = false;
    } else if (this.velocity.x < -1) {
      this.flipToLeft = true;
    }

    super.update(c, deltaTime, entities);
    this.currentState.update();

    if (this.isDev) {
      this.paintStates({
        c,
        msj: this.currentState.state,
        x: this.position.x - 5,
        y: this.position.y - 20,
      });
      this.drawZone(c);
    }
  }
  onCollisionCanvasHorizontal() {
    this.velocity.x = this.velocity.x > 0 ? -this.speed : this.speed;
  }
  onCollisionCanvasVertical() {
    this.velocity.y = -this.velocity.y;
  }

  onCollicioBlockHorizontalLeft(collisionBlock) {
    super.onCollicioBlockHorizontalLeft(collisionBlock);
    this.velocity.x = this.velocity.y > 0 ? this.speed : -this.speed; // Invertir la dirección en el eje X
    // this.position.x = collisionBlock.position.x - this.width - 1; // Ajuste de posición
  }
  onCollicioBlockHorizontalRight(collisionBlock) {
    super.onCollicioBlockHorizontalRight(collisionBlock);
    setTimeout(() => {
      this.velocity.x = this.velocity.y > 0 ? this.speed : -this.speed; // Invertir la dirección en el eje X
    }, 10);

    // this.position.x = collisionBlock.position.x - this.width - 1; // Ajuste de posición
  }
  onCollicioBlockVerticalTop(collisionBlock) {
    super.onCollicioBlockVerticalTop(collisionBlock);

    this.velocity.y = -this.speed; // Invertir la dirección en el eje Y
    // this.position.y = collisionBlock.position.y + collisionBlock.height + 1;
  }
  onCollicioBlockVerticalBottom(collisionBlock) {
    super.onCollicioBlockVerticalBottom(collisionBlock);
    this.velocity.y = this.speed; // Invertir la dirección en el eje Y
    // this.position.y = collisionBlock.position.y - this.height - 1;
  }

  onCollision(other) {
    // if (this.isDev) {console.log(`Colisión entre ${this.tag} y ${other.tag}`)}
    // Manejar la colisión de alguna manera
    if (this.currentState.state !== npcStates.NPC_CHACE) {
      changeState({
        character: this,
        nextState: npcStates.NPC_CHACE,
        lastDercion: this.lastDercion,
        frameY: this.frameY,
        speedY: 0,
      });
      this.currentState?.chasePlayer(other);
    } else {
      console.log("ya estas persiguiendo");
    }
  }
  releaseCollision(other){
    
  }
}
