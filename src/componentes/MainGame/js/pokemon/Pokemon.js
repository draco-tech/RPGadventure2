import { NPC } from "../npc/NPC";
import { changeState } from "../utils";
import { detectCollisionCircle } from "../utils";

import { npcStates, PKM_CHASE, PKM_IDLE, PKM_PATROL } from "./pokemonStaes";

class Pokemon extends NPC {
  constructor({
    position,
    allimages,
    frameWidth = 178,
    frameHeight = 178,
    tag,
  }) {
    super({
      position,
      // img: "public/pokemon/" + allimages[0] + ".png",
      frameWidth,
      frameHeight,
      tag,
      allstates: [PKM_IDLE, PKM_PATROL, PKM_CHASE],
    });
    this.position = position;
    this.allimages = allimages;
    this.imgIndex = 0;
    this.sprite = allimages.map((_) => new Image());
    // this.sprite[this.imgIndex].src = "public/pokemon/" + allimages[this.imgIndex] + ".png";
    this.sprites = allimages.map(
      (img, ind) => (this.sprite[ind].src = "pokemon/" + img + ".png")
    );
    this.frameWidth = frameWidth;
    this.frameHeight = frameHeight;
    //maxFrame;
    this.frameX = 1;
    this.frameY = 2;
    this.selectedFrameY = 2;
    this.maxFrame = this.frameY + 1;
    this.radius = 50;
    this.speed = 2;
    this.isDev = false;
    this.fps = 14;
    this.timeOfInterval = 4000;
    this.frameInterval = this.timeOfInterval / this.fps;
    this.isEated = false;
    this.pokemonEated = 0;
    this.imgToChow = this.sprite[this.imgIndex];
    this.pokemonToEvleve = 0;
  }
  update(c, deltaTime, entities) {
    super.update(c, deltaTime, entities);
    this.changeSprite(this.velocity);
  }
  changeSprite(dirección) {
    const x = dirección.x === 0 ? 0 : dirección.x > 0 ? 1 : -1;
    const y = dirección.y === 0 ? 0 : dirección.y > 0 ? 1 : -1;

    const direcciónKey = `${x},${y}`;
    switch (direcciónKey) {
      // right
      case "1,0":
      case "1,1":
      case "1,-1":
        this.flipSprite("right");
        break;

      // down
      case "0,1":
        this.flipSprite("down");
        break;

      // left
      case "-1,0":
      case "-1,1":
      case "-1,-1":
        this.flipSprite("left");
        break;

      // up
      case "0,-1":
        this.flipSprite("up");
        break;

      default:
        return;
    }
  }
  flipSprite(dirección) {
    switch (dirección) {
      case "left":
        this.frameX = 1;
        this.frameY = 0;
        this.selectedFrameY = 0;
        break;
      case "up":
        this.frameX = 0;
        this.frameY = 0;
        this.selectedFrameY = 0;
        break;
      case "down":
        this.frameX = 0;
        this.frameY = 2;
        this.selectedFrameY = 2;
        break;
      case "right":
        this.frameX = 1;
        this.frameY = 2;
        this.selectedFrameY = 2;
        break;
      default:
        return;
    }
  }
  drawSprite(c, deltaTime) {
    //sprrite animation
    if (this.frameTime > this.frameInterval) {
      this.frameTime = 0;
      if (this.frameY < this.maxFrame) this.frameY++;
      else this.frameY = this.selectedFrameY;
    } else this.frameTime += deltaTime;

    // Ajustar la posición en X para que la imagen se pinte correctamente si está invertida
    c.drawImage(
      this.imgToChow,
      this.frameX * this.frameWidth,
      this.frameY * this.frameHeight,
      this.frameWidth,
      this.frameHeight,
      this.position.x - this.sizeSprite / 5, // Posición normal
      this.position.y - this.sizeSprite / 5 - 8,
      this.sizeSprite,
      this.sizeSprite
    );
  }
  onCollision(other) {
    // if (this.isDev) {console.log(`Colisión entre ${this.tag} y ${other.tag}`)}
    // Manejar la colisión de alguna manera
    //other.this.isEated = true
    if (this.currentState.state !== npcStates.PKM_CHACE) {
      changeState({
        character: this,
        nextState: npcStates.PKM_CHACE,
        speedY: 0,
      });
      this.currentState?.chasePlayer(other);
    }
  }
  releaseCollision(other) {}
  pokemonRelease(pokemon) {
    changeState({
      character: this,
      nextState: npcStates.PKM_IDLE,
      speedY: 0,
    });
  }
  onCollicioBlockHorizontalLeft(collisionBlock) {
    this.velocity.x = 0;
    this.position.x = collisionBlock.position.x + collisionBlock.width + 2; // Ajuste de posición para alinearse correctamente al borde del bloque
    this.pokemonRelease(collisionBlock);
  }
  onCollicioBlockHorizontalRight(collisionBlock) {
    this.velocity.x = 0;
    this.position.x = collisionBlock.position.x - this.width - 2; // Ajuste de posición para alinearse correctamente al borde del bloque
    this.pokemonRelease(collisionBlock);
  }
  onCollicioBlockVerticalTop(collisionBlock) {
    this.velocity.y = 0;
    this.position.y = collisionBlock.position.y - this.height - 2; // Ajuste de posición para alinearse correctamente al borde del bloque
    this.pokemonRelease(collisionBlock);
  }
  onCollicioBlockVerticalBottom(collisionBlock) {
    this.velocity.y = 0;
    this.position.y = collisionBlock.position.y + collisionBlock.height + 2; // Ajuste de posición para alinearse correctamente al borde del bloque
    this.pokemonRelease(collisionBlock);
  }
  pokemonEat() {
    if (this.imgIndex + 1 < this.allimages.length) {
      this.imgIndex++;
    }

    this.speed += 5;
    this.pokemonEated++;
  }
  checkEntetiesCollisions(entities) {
    // Verificar colisiones con otras entidades
    entities?.forEach((other) => {
      if (other !== this) {
        this.checkCollisionsBlocksHorizontal([other]);
        this.checkCollisionsBlocksVertical([other]);
        // if (   detectCollisionCircle(this, other)) {

        //    this.onCollision(other);
        // }else{
        //   this.releaseCollision(other);
        // }
      }
    });
  }
}

// Exportación condicional
if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
  module.exports = Pokemon; // Para Node.js
} else {
}
export default Pokemon; // Para el navegador
