import MainCharacter from "../Class";
import { changeState } from "../utils";

import {
  NPC_ATTACK,
  NPC_CHASE,
  NPC_HITED,
  NPC_IDLE,
  NPC_PATROL,
  npcStates,
} from "./npcState";

export class NPC extends MainCharacter {
  constructor({
    position,
    img = "public/blueNinja/ninjaBluAll.png",
    frameWidth = 32,
    frameHeight = 32,
    maxFrame = 10,
    allstates = [NPC_IDLE, NPC_PATROL, NPC_CHASE, NPC_ATTACK, NPC_HITED],
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
    this.radius = 200;
    this.speed = 2;

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
      this.paintLive(c);
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

    this.currentState.onCollision(other);
  }
  releaseCollision(other) {}
  onCollisionForAttack(other) {
    this.currentState.onCollisionForAttack(other);
  }
  releaseCollisionForAttack(character) {
    this.currentState.releaseCollisionForAttack(character);
  }
  reciveDamage(player) {
    if (this.currentState.state !== npcStates.NPC_HITED) {
      super.reciveDamage();
      changeState({
        character: this,
        nextState: npcStates.NPC_HITED,
        lastDercion: this.lastDercion,
        speedY: 0,
      });
      if (this.life > 0) {
        this.life -= 1;
        if (this.life <= 0) {
          this.isDead = true;
          player.enemiesKilles++;
        }
      }
    }
  }
}
