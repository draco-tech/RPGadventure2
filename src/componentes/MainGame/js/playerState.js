const states = {
  IDLE: 0,
  RUNNING: 1,
};

const acctionsSprite = {
  idleRight: 0,
  idleLeft: 4,
  runRight: 1,
  runLeft: 5,
};

class State {
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
  enter(player) {
    this.player.lastDercion == "left"
      ? (this.player.frameY = acctionsSprite.idleLeft)
      : (this.player.frameY = acctionsSprite.idleRight);
  }
  handleKeyDown(event) {
    switch (event.key) {
      case "ArrowUp":
        changeState({
          player: this.player,
          nextState: states.RUNNING,
          lastDercion: this.player.lastDercion,
          frameY:
            this.player.lastDercion == "left"
              ? acctionsSprite.runLeft
              : acctionsSprite.runRight,
          speedY: -this.player.speed,
        });

        break;
      case "ArrowDown":
        changeState({
          player: this.player,
          nextState: states.RUNNING,
          lastDercion: this.player.lastDercion,
          frameY:
            this.player.lastDercion == "left"
              ? acctionsSprite.runLeft
              : acctionsSprite.runRight,
          speedY: this.player.speed,
        });

        break;
      case "ArrowLeft":
        changeState({
          player: this.player,
          nextState: states.RUNNING,
          lastDercion: "left",
          frameY:
            this.player.lastDercion == "left"
              ? acctionsSprite.runLeft
              : acctionsSprite.runRight,
          speedX: -this.player.speed,
        });
        break;
      case "ArrowRight":
        changeState({
          player: this.player,
          nextState: states.RUNNING,
          lastDercion: "right",
          frameY:
            this.player.lastDercion == "left"
              ? acctionsSprite.runLeft
              : acctionsSprite.runRight,
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
    const { player } = this;

    switch (event.key) {
      case "ArrowUp":
        changeState({
          player,
          nextState: states.RUNNING,
          lastDercion: player.lastDercion,
          frameY:
            player.lastDercion == "left"
              ? acctionsSprite.runLeft
              : acctionsSprite.runRight,
          speedY: -player.speed,
        });

        break;
      case "ArrowDown":
        changeState({
          player,
          nextState: states.RUNNING,
          lastDercion: player.lastDercion,
          frameY:
            player.lastDercion == "left"
              ? acctionsSprite.runLeft
              : acctionsSprite.runRight,
          speedY: player.speed,
        });
        break;
      case "ArrowLeft":
        changeState({
          player,
          nextState: states.RUNNING,
          lastDercion: "left",
          frameY: acctionsSprite.runLeft,
          speedX: -player.speed,
        });

        break;
      case "ArrowRight":
        changeState({
          player,
          nextState: states.RUNNING,
          lastDercion: "right",
          frameY: acctionsSprite.runRight,
          speedX: player.speed,
        });

        break;
    }
  }
  handleKeyUp(event) {
    let { player } = this;

    this.player.velocity = {
      x: 0,
      y: 0,
    };
    switch (event.key) {
      case "ArrowUp":
      case "ArrowDown":
        changeState({
          player,
          nextState: states.IDLE,
          lastDercion: player.lastDercion,
          frameY: acctionsSprite.idleLeft,
        });
        break;
      case "ArrowLeft":
        changeState({
          player,
          nextState: states.IDLE,
          lastDercion: "left",
          frameY: acctionsSprite.idleLeft,
        });
        break;
      case "ArrowRight":
        changeState({
          player,
          nextState: states.IDLE,
          lastDercion: "right",
          frameY: acctionsSprite.idleRight,
        });
        break;
    }
  }

  exit(player) {}
}

function changeState({
  player,
  nextState,
  lastDercion,
  frameY,
  speedX = 0,
  speedY = 0,
}) {
  player.lastDercion = lastDercion;
  player.frameY = frameY;
  player.velocity.x = speedX;
  player.velocity.y = speedY;

  if (nextState != player.indexState) {
    player.indexState = nextState;

    // make a change state
    player.currentState.exit(this);
    player.currentState = player.states[player.indexState];
    player.currentState.enter(this);
  }
}
