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
    this.sprite.src = "blueNinja/ninjaBluAll.png";
    this.socketID = socketID;

    this.currentState.enter();
  }

  update(c, deltaTime, entities) {
    super.update(c, deltaTime, entities);
    this.paintStates({
      c,
      msj: this.currentState.state,
      x: this.position.x - 5,
      y: this.position.y - 20,
    });
  }
}

export default PlayerOf;
