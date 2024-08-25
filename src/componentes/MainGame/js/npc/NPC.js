import MainCharacter from "../Class";
import { changeState } from "../playerState";
import { NPC_CHASE, NPC_IDLE, NPC_PATROL, npcStates } from "./npcState";

export class NPC extends MainCharacter {
  constructor({
    position,
    img = "public/blueNinja/ninjaBluAll.png",
    frameWidth = 32,
    frameHeight = 32,
    maxFrame = 5,
    allstates = [NPC_IDLE, NPC_PATROL, NPC_CHASE],
    tag,
  }) {
    super({
      position,
      allstates,
      tag,
    });
    this.sprite.src = img;
    this.velocity = { x: 0, y: 0 };
    this.frameWidth = frameWidth;
    this.frameHeight = frameHeight;
    this.maxFrame = maxFrame;

    this.fps = 2;
    this.radius = 50;
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
    }
  }
  releaseCollision(other) {}
}
