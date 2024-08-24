import { changeState, State } from "../playerState";

export const npcStates = {
  PKM_IDLE: 0,
  PKM_PATROL: 1,
  PKM_CHACE: 2,
};



class NPC_STATE extends State {
  constructor(state, player) {
    super(state, player);
    this.interval = null;
    this.timeout = null;
    this.timeInterval = 0;
  }

  enter() {
    super.enter();
    this.timeInterval = Math.random() * 4000 + 500; // Cambia el tiempo de intervalo cada vez que entras en el estado
  }
  update() {}
  exit() {
    super.exit();
    if (this.interval) clearInterval(this.interval);
    if (this.timeout) clearTimeout(this.timeout);
  }
}

export class PKM_IDLE extends NPC_STATE {
  constructor(player) {
    super("P_IDLE", player);
  }

  enter() {
    this.player.velocity.x = 0;
    this.player.velocity.y = 0;
    super.enter();
    this.timeout = setTimeout(() => {
      changeState({
        character: this.player,
        nextState: npcStates.PKM_PATROL,
        lastDercion: this.player.lastDercion,
        speedY: 0,
      });

  
    }, this.timeInterval);
  }
  update() {}
  exit() {}
}
export class PKM_PATROL extends NPC_STATE {
  constructor(player) {
    super("P_PATROL", player);
  }

  enter() {
    super.enter();
    const { x, y } = this.getRandomVelocity(this.player.speed);
  
    // this.player.flipSprite({x, y});
    
    this.player.velocity.x = x;
    this.player.velocity.y = y;

    this.timeout = setTimeout(() => {
      changeState({
        character: this.player,
        nextState: npcStates.PKM_IDLE,

      });
    }, this.timeInterval);
  }

  update(deltaTime) {}
  getRandomVelocity(speed) {
    // Genera una velocidad aleatoria para X
    const randomX =
      Math.random() > 0.66 ? speed : Math.random() < 0.5 ? -speed : 0;

    // Si la velocidad en X no es cero, entonces Y debe ser cero
    const randomY =
      randomX !== 0
        ? 0
        : Math.random() > 0.66
        ? speed
        : Math.random() < 0.5
        ? -speed
        : 0;

    return {
      x: randomX,
      y: randomY,
    };
  }

  exit() {}
}






export class PKM_CHASE extends NPC_STATE {
  constructor(player) {
    super("P_CHASE", player);
  }

  enter() {
    super.enter();
    this.player.radius = 60;
    this.player.speed = 3;
    this.timeout = setTimeout(() => {
      changeState({
        character: this.player,
        nextState: npcStates.PKM_IDLE,
        lastDercion: this.player.lastDercion,
      });
    }, this.timeInterval + 2000);
  }
  update() {}
  chasePlayer(enemy) {
    // Calcular la dirección hacia el jugador
    const dx = enemy.position.x - this.player.position.x;
    const dy = enemy.position.y - this.player.position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Normalizar la dirección y establecer la velocidad
    this.player.velocity.x = (dx / distance) * this.player.speed;
    this.player.velocity.y = (dy / distance) * this.player.speed;
  }
  exit() {
    super.exit();
    this.player.radius = 50;
    this.player.speed = 1;
  }
}
