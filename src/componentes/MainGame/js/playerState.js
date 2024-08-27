import { changeState } from "./utils";

export const playerStates = {
  IDLE: 0,
  RUNNING: 1,
  ATTACK: 2,
  HITED: 3,
  DASH:4
};

const acctionsSprite = {
  idle: 0,
  run: 1,
  attack: 2,
  hited: 3,
  dash:4
};

const keyActions = {
  a: {
    state: playerStates.ATTACK,
    action: (player) => ({
      character: player,
      nextState: playerStates.ATTACK,
      lastDercion: player.lastDercion,
    }),
  },
  s: {
    state: playerStates.DASH,
    action: (player) => ({
      character: player,
      nextState: playerStates.DASH,
      lastDercion: player.lastDercion,
    }),
  },
  ArrowUp: {
    state: playerStates.RUNNING,
    action: (player) => ({
      character: player,
      nextState: playerStates.RUNNING,
      lastDercion: player.lastDercion,
      speedY: -player.speed,
    }),
  },
  ArrowDown: {
    state: playerStates.RUNNING,
    action: (player) => ({
      character: player,
      nextState: playerStates.RUNNING,
      lastDercion: player.lastDercion,
      speedY: player.speed,
    }),
  },
  ArrowLeft: {
    state: playerStates.RUNNING,
    action: (player) => ({
      character: player,
      nextState: playerStates.RUNNING,
      lastDercion: "left",
      speedX: -player.speed,
    }),
  },
  ArrowRight: {
    state: playerStates.RUNNING,
    action: (player) => ({
      character: player,
      nextState: playerStates.RUNNING,
      lastDercion: "right",
      speedX: player.speed,
    }),
  },
};

export class State {
  constructor(state, player) {
    this.state = state;
    this.player = player;
    this.timeout = null
  }

  enter() {}
  handleKeyDown(event) {
    const action = keyActions[event.key];
    if (action) {
      changeState(action.action(this.player));
    }
  }
  handleKeyUp(event) {
    this.player.velocity = { x: 0, y: 0 };
    const action = keyActions[event.key];
    if (action) {
      const idleAction = {
        character: this.player,
        nextState: playerStates.IDLE,
        lastDercion: this.player.lastDercion,
      };

      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        idleAction.lastDercion = event.key === "ArrowLeft" ? "left" : "right";
      }

      changeState(idleAction);
    }
  }

  exit() {
    if (this.timeout) clearTimeout(this.timeout);
  }

  onCollision(other) {}
  releaseCollision(other) {}
  onCollisionForAttack(other) {}
  releaseCollisionForAttack(character) {}
}

export class IDLE extends State {
  constructor(player) {
    super("IDLE", player);
  }
  enter() {
    this.player.frameY = acctionsSprite.idle;
    this.player.velocity = { x: 0, y: 0 };
  }
  handleKeyDown(event) {
    super.handleKeyDown(event);
  }
  handleKeyUp(event) {
    super.handleKeyUp(event);
  }
  exit(player) {}
}

export class RUNNING extends State {
  constructor(player) {
    super("RUNNING", player);
  }
  enter(player) {
    this.player.frameY = acctionsSprite.run;
  }
  handleKeyDown(event) {
    super.handleKeyDown(event);
  }
  handleKeyUp(event) {
    super.handleKeyUp(event);
  }

  exit(player) {}
}

export class ATTACK extends State {
  constructor(player) {
    super("ATTACK", player);
  }
  enter() {
    this.player.frameY = acctionsSprite.attack;
    this.player.attackRadio = 30;
  }
  handleKeyDown(event) {
    super.handleKeyDown(event);
  }
  handleKeyUp(event) {
    super.handleKeyUp(event);
  }
  exit(player) {
    this.player.attackRadio = 15;
  }
  onCollisionForAttack(other) {
    if (this.player.keyPress) {
      other?.reciveDamage(this.player);
      other.x += this.player.attackRadio + 5;
    }
  }
}

export class HITED extends State {
  constructor(player) {
    super("HITED", player);
    this.timeout = null;
  }
  enter() {
    super.enter();
    this.player.velocity = { x: 0, y: 0 };
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
        nextState: playerStates.IDLE,
        lastDercion: this.player.lastDercion,
        speedY: 0,
      });
    }, 1000);
  }
  handleKeyDown(event) {}
  handleKeyUp(event) {}
  exit() {
    super.exit()
    this.player.attackRadio = 15;
   
  }
  onCollisionForAttack(other) {}
}

export class DASH extends State {
  constructor(player) {
    super("DASH", player);
  }
  enter() {
    this.player.frameY = acctionsSprite.dash;
    this.player.speed = 45
    this.player.attackRadio = 30;
    this.timeout = setTimeout(() => {
      changeState({
        character: this.player,
        nextState: playerStates.IDLE,
        lastDercion: this.player.lastDercion,
        speedY: 0,
      });
    }, 1000);
  }
  handleKeyDown(event) {
    // super.handleKeyDown(event);
  }
  handleKeyUp(event) {
    // super.handleKeyUp(event);
  }
  exit() {
    super.exit()
    this.player.attackRadio = 15;
    this.player.speed = 2
  }
  onCollisionForAttack(other) {
    if (this.player.keyPress) {
      other?.reciveDamage(this.player);
      other.x += this.player.attackRadio + 5;
    }
  }
}