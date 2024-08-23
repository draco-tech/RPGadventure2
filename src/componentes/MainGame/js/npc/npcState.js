import { changeState, State } from "../playerState";

export const npcStates = {
  NPC_IDLE: 0,
  NPC_PATROL: 1,
  NPC_CHACE: 2,
};

export class NPC_IDLE extends State {
  constructor(player) {
    super("IDLE", player);
    
  }

  enter() {
    
    setTimeout(() => {
      changeState({
        character: this.player,
        nextState: npcStates.NPC_PATROL,
        lastDercion: this.player.lastDercion,
        frameY: this.player.frameY,
        speedY: 0,
      })
    },3000)
  }
  update() {
    
  }
  exit() {
    console.log("exit", this.state);
  }
}
export class NPC_PATROL  extends State {
  constructor(player) {
    super("PATROL", player);
    
  }

  enter() {
    this.player.velocity.y = Math.random() > 0.5 ? this.player.speed : -this.player.speed;
    this.player.velocity.x = Math.random() > 0.5 ? this.player.speed : -this.player.speed;
  }
 
    update(deltaTime) {

    }
    
  
  exit() {
    console.log("exit", this.state);
  }
}

export class NPC_CHASE extends State {
  constructor(player) {
    super("CHASE", player);
    
  }

  enter() {
    this.player.radius = 60;
    this.player.speed = 3
    setTimeout(() => {
      changeState({
        character: this.player,
        nextState: npcStates.NPC_PATROL,
        lastDercion: this.player.lastDercion,
        frameY: this.player.frameY,
      })
     }, 5000);
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
    this.player.radius = 50;
    this.player.speed =1
    console.log("exit", this.state);
  }
}

