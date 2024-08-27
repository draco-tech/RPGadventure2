import { changeState, State } from "../playerState";

export const npcStates = {
  NPC_IDLE: 0,
  NPC_PATROL: 1,
  NPC_CHACE: 2,
};

const acctionsSprite = {
  idle: 0,
  run: 1,
};

class NPC_STATE extends State {
  constructor(state ,player) {
    super(state, player);
    this.interval = null;
    this.timeout = null;
    this.timeInterval = 0;
  }

  enter() {
    this.player.velocity = {
      x: 0,
      y: 0
    }
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

export class NPC_IDLE extends NPC_STATE {
  constructor(player) {
    super("IDLE", player);
    
    
  }

  enter() {
    super.enter();
    this.player.frameY = acctionsSprite.idle;
    this.interval = setInterval(() => {
      this.player.flipToLeft = !this.player.flipToLeft
    },this.timeInterval)
  
    
   this.timeout = setTimeout(() => {
      changeState({
        character: this.player,
        nextState: npcStates.NPC_PATROL,
        lastDercion: this.player.lastDercion,
        speedY: 0,
      })

      clearInterval(this.interval);
      this.interval = null; // Opcional: Limpiar la referencia para evitar problemas




    },this.timeInterval)

   
  }
  update() {}
  exit() {}
}
export class NPC_PATROL  extends NPC_STATE {
  constructor(player) {
    super("PATROL", player);
    
  }

  enter() {
    super.enter();
    this.player.frameY = acctionsSprite.run;
    this.player.velocity.y = Math.random() > 0.5 ? this.player.speed : -this.player.speed;
    this.player.velocity.x = Math.random() > 0.5 ? this.player.speed : -this.player.speed;

    this.timeout = setTimeout(() => {
      changeState({
        character: this.player,
        nextState: npcStates.NPC_IDLE,
        lastDercion: this.player.lastDercion,
        speedY: 0,
      })
    },this.timeInterval)
  }
 
    update(deltaTime) {

    }
    
  
  exit() {
   
  }
}

export class NPC_CHASE extends NPC_STATE {
  constructor(player) {
    super("CHASE", player);
    
  }

  enter() {
    super.enter();
    this.player.frameY = acctionsSprite.run;
    this.player.radius = 60;
    this.player.speed = 3
    this.timeout = setTimeout(() => {
      changeState({
        character: this.player,
        nextState: npcStates.NPC_IDLE,
        lastDercion: this.player.lastDercion,
        frameY: acctionsSprite.idle,
      })
     }, this.timeInterval + 2000);
  }
  update() {
    
  }
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
    this.player.speed =1
  
  }
}

