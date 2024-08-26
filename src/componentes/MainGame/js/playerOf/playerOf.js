import MainCharacter from "../Class";
import { PLAYEROF_STATE } from "./playerOfState";

class PlayerOf extends MainCharacter {
  constructor({
    position,
    socketID,
    frameWidth = 32,
    frameHeight = 32,
    maxFrame = 5,
  }) {
    super({
      position,
      tag: "playerOf",
      allstates: [PLAYEROF_STATE],
      frameWidth,
      frameHeight,
      maxFrame,
    });
    this.sprite.src = "blueNinja/grogGreenAll.png";
    this.socketID = socketID;
    this.keyPress = false;
    this.currentState.enter();
  }

  update(c, deltaTime, entities) {
    super.update(c, deltaTime, entities);

    if (this.keyPress) {
      this.frameY = 1;
    } else {
      this.frameY = 0;
    }

    this.paintStates({
      c,
      msj: this.currentState.state,
      x: this.position.x - 5,
      y: this.position.y - 20,
    });
  }
}

export default PlayerOf;
