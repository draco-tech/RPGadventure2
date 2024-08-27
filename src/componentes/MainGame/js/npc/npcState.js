import { State } from "../playerState";
import { changeState } from "../utils";

export const npcStates = {
  NPC_IDLE: 0,
  NPC_PATROL: 1,
  NPC_CHACE: 2,
  NPC_ATTACK: 3,
  NPC_HITED: 4,
};

const acctionsSprite = {
  idle: 0,
  run: 1,
  attack: 2,
  hited: 3,
};

class NPC_STATE extends State {
  constructor(state, player) {
    super(state, player);
    this.interval = null;
    this.timeout = null;
    this.timeInterval = 0;
  }

  enter() {
    this.player.velocity = {
      x: 0,
      y: 0,
    };
    super.enter();
    this.timeInterval = Math.random() * 4000 + 500; // Cambia el tiempo de intervalo cada vez que entras en el estado
  }
  update() {}
  exit() {
    super.exit();
    if (this.interval) clearInterval(this.interval);
    if (this.timeout) clearTimeout(this.timeout);
  }

  onCollision(other) {
    changeState({
      character: this.player,
      nextState: npcStates.NPC_CHACE,
      lastDercion: this.lastDercion,
      frameY: this.frameY,
      speedY: 0,
    });
  }
  releaseCollision(other) {}
  onCollisionForAttack(other) {
    changeState({
      character: this.player,
      nextState: npcStates.NPC_ATTACK,
      lastDercion: this.player.lastDercion,
      frameY: this.frameY,
      speedY: 0,
    });
    other?.reciveDamage();
  }
  releaseCollisionForAttack(character) {}
  getRandomVelocity(speed) {
    // Genera un número aleatorio entre 0 y 1
    const randomValue = Math.random();

    let velocity = { x: 0, y: 0 };

    // Si el valor aleatorio es mayor a 0.5, se asigna velocidad en X
    if (randomValue > 0.5) {
      velocity.x = Math.random() > 0.5 ? speed : -speed;
    } else {
      // Si el valor aleatorio es menor o igual a 0.5, se asigna velocidad en Y
      velocity.y = Math.random() > 0.5 ? speed : -speed;
    }

    return velocity;
  }
}

export class NPC_IDLE extends NPC_STATE {
  constructor(player) {
    super("IDLE", player);
  }

  enter() {
    super.enter();
    this.player.radius = 200;
    this.player.frameY = acctionsSprite.idle;

    this.timeout = setTimeout(() => {
      changeState({
        character: this.player,
        nextState: npcStates.NPC_PATROL,
        lastDercion: this.player.lastDercion,
        speedY: 0,
      });

      clearInterval(this.interval);
      this.interval = null; // Opcional: Limpiar la referencia para evitar problemas
    }, this.timeInterval);
  }
  update() {}
  exit() {
    this.player.radius = 200;
  }
  onCollision(other) {
    super.onCollision(other);
  }
  releaseCollision(other) {}
  onCollisionForAttack(other) {
    super.onCollisionForAttack(other);
  }
  releaseCollisionForAttack(character) {}
}
export class NPC_PATROL extends NPC_STATE {
  constructor(player) {
    super("PATROL", player);
  }

  enter() {
    super.enter();
    this.player.frameY = acctionsSprite.run;
    const { x, y } = this.getRandomVelocity(this.player.speed);
    this.player.velocity = { x, y };

    this.timeout = setTimeout(() => {
      changeState({
        character: this.player,
        nextState: npcStates.NPC_IDLE,
        lastDercion: this.player.lastDercion,
        speedY: 0,
      });
    }, this.timeInterval);
  }

  update(deltaTime) {}

  exit() {}
  onCollision(other) {
    super.onCollision(other);
  }
  releaseCollision(other) {}
  onCollisionForAttack(other) {
    super.onCollisionForAttack(other);
  }
  releaseCollisionForAttack(character) {}
}

export class NPC_CHASE extends NPC_STATE {
  constructor(player) {
    super("CHASE", player);
  }

  enter() {
    super.enter();
    this.player.frameY = acctionsSprite.run;
    // this.player.radius = 60;
    this.player.speed = 3;
    this.timeout = setTimeout(() => {
      changeState({
        character: this.player,
        nextState: npcStates.NPC_IDLE,
        lastDercion: this.player.lastDercion,
        frameY: acctionsSprite.idle,
      });
    }, this.timeInterval + 2000);
  }
  update() {}
  chasePlayer(enemy) {
    // Calcular la dirección hacia el jugador
    const dx = enemy.position.x - this.player.position.x;
    const dy = enemy.position.y - this.player.position.y;

    // Decidir si moverse en el eje X o en el eje Y, priorizando la dirección con la mayor distancia
    if (Math.abs(dx) > Math.abs(dy)) {
      // Moverse en el eje X
      this.player.velocity.x = dx > 0 ? this.player.speed : -this.player.speed;
      this.player.velocity.y = 0; // No moverse en Y
    } else {
      // Moverse en el eje Y
      this.player.velocity.y = dy > 0 ? this.player.speed : -this.player.speed;
      this.player.velocity.x = 0; // No moverse en X
    }
  }
  exit() {
    super.exit();
    // this.player.radius = 50;
    this.player.speed = 2;
  }
  onCollision(other) {
    super.onCollision(other);

    this.chasePlayer(other);
  }
  releaseCollision(other) {}
  onCollisionForAttack(other) {
    super.onCollisionForAttack(other);
  }
  releaseCollisionForAttack(character) {}
}

export class NPC_ATTACK extends NPC_STATE {
  constructor(player) {
    super("ATTACK", player);
  }

  enter() {
    super.enter();
    this.player.frameY = acctionsSprite.attack;
    this.velocity = {
      x: 0,
      y: 0,
    };
  }
  update() {}
  exit() {}
  onCollision(other) {}
  releaseCollision(other) {}
  onCollisionForAttack(other) {}
  releaseCollisionForAttack(character) {}
}

export class NPC_HITED extends NPC_STATE {
  constructor(player) {
    super("HITED", player);
  }

  enter() {
    super.enter();
    this.player.radius = 0;
    this.player.attackRadio = 0;
    this.player.frameY = acctionsSprite.hited;

    this.player.incialFrameX = 2;

    this.player.maxFrame = 9;

    this.velocity = {
      x: 0,
      y: 0,
    };

    this.timeout = setTimeout(() => {
      changeState({
        character: this.player,
        nextState: npcStates.NPC_IDLE,
        lastDercion: this.player.lastDercion,
        speedY: 0,
      });
    }, 3000);
  }
  update() {}
  exit() {
    super.exit();
    this.player.incialFrameX = 0;
    this.player.maxFrame = 10;
    this.player.radius = 200;
    this.player.attackRadio = 15;
  }
  onCollision(other) {}
  releaseCollision(other) {}
  onCollisionForAttack(other) {}
  releaseCollisionForAttack(character) {}
}
