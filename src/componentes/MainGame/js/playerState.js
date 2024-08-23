const states = {
  IDLE: 0,
  RUNNING: 1,
};

const acctionsSprite = {
  idle: 0,
  run: 1,
};

export class State {
  constructor(state, player) {
    this.state = state;
    this.player = player;
  }

  enter() {
    console.log("enter", this.state);
  }
  exit() {
    console.log("exit", this.state);
  }
}

export class IDLE extends State {
  constructor(player) {
    super("IDLE", player);
  }
  enter() {
    this.player.frameY = acctionsSprite.idle;
  }
  handleKeyDown(event) {
    switch (event.key) {
      case "ArrowUp":
        changeState({
          character: this.player,
          nextState: states.RUNNING,
          lastDercion: this.player.lastDercion,
          frameY:acctionsSprite.run,
          speedY: -this.player.speed,
        });

        break;
      case "ArrowDown":
        changeState({
          character: this.player,
          nextState: states.RUNNING,
          lastDercion: this.player.lastDercion,
          frameY:acctionsSprite.run,
          speedY: this.player.speed,
        });

        break;
      case "ArrowLeft":
        changeState({
          character: this.player,
          nextState: states.RUNNING,
          lastDercion: "left",
          frameY: acctionsSprite.run,
          speedX: -this.player.speed,
        });
        break;
      case "ArrowRight":
        changeState({
          character: this.player,
          nextState: states.RUNNING,
          lastDercion: "right",
          frameY:acctionsSprite.run,
          speedX: this.player.speed,
        });

        break;
    }
  }
  handleKeyUp(event, player) {}
  exit(player) {}
}

export class RUNNING extends State {
  constructor(player) {
    super("RUNNING", player);
  }
  enter(player) {}
  handleKeyDown(event) {
   

    switch (event.key) {
      case "ArrowUp":
        changeState({
          character: this.player ,
          nextState: states.RUNNING,
          lastDercion: this.player.lastDercion,
          frameY:acctionsSprite.run,
          speedY: -this.player.speed,
        });

        break;
      case "ArrowDown":
        changeState({
          character:  this.player,
          nextState: states.RUNNING,
          lastDercion: this.player.lastDercion,
          frameY:acctionsSprite.run,
          speedY: this.player.speed,
        });
        break;
      case "ArrowLeft":
        changeState({
          character:  this.player,
          nextState: states.RUNNING,
          lastDercion: "left",
          frameY: acctionsSprite.run,
          speedX: -this.player.speed,
        });

        break;
      case "ArrowRight":
        changeState({
          character:  this.player,
          nextState: states.RUNNING,
          lastDercion: "right",
          frameY: acctionsSprite.run,
          speedX: this.player.speed,
        });

        break;
    }
  }
  handleKeyUp(event) {
    

    this.player.velocity = {
      x: 0,
      y: 0,
    };
    switch (event.key) {
      case "ArrowUp":
      case "ArrowDown":
        changeState({
          character:  this.player,
          nextState: states.IDLE,
          lastDercion: this.player.lastDercion,
          frameY: acctionsSprite.idle,
        });
        break;
      case "ArrowLeft":
        changeState({
          character:  this.player,
          nextState: states.IDLE,
          lastDercion: "left",
          frameY: acctionsSprite.idle,
        });
        break;
      case "ArrowRight":
        changeState({
          character:  this.player,
          nextState: states.IDLE,
          lastDercion: "right",
          frameY: acctionsSprite.idle,
        });
        break;
    }
  }

  exit(player) {}
}

export function changeState({
  character,
  nextState,
  lastDercion,
  frameY,
  speedX = 0,
  speedY = 0,
}) {
  character.lastDercion = lastDercion;
  character.frameY = frameY;
  character.velocity.x = speedX;
  character.velocity.y = speedY;

  if (nextState != character.indexState) {
    character.indexState = nextState;

    // make a change state
    character.currentState.exit(this);
    character.currentState = character.states[character.indexState];
    character.currentState.enter(this);
  }
}
