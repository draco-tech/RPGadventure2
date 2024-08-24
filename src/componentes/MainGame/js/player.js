import MainCharacter from "./Class";
import { IDLE, RUNNING } from "./playerState";


class Player extends MainCharacter {
  constructor({ position, mundo , }) {
    super({ position, mundo ,allstates:[IDLE,RUNNING]  });
    this.speed = 5
    this.camera = {
      x: this.position.x,
      y: this.position.y,
      w: 500,
      h: 500,
      isFollowing: true,
      moveX: 0,
      moveY: 0,
    };
    this.keyPress = false;
    this.mundo = mundo;
    this.tag = "player"
    this.sprite.src = "public/blueNinja/grogGreenAll.png";
    this.isDev = false
   
   
   
  }

  update(c, deltaTime , entities, canvas ) {
    super.update(c, deltaTime, entities);
    this.input();

    this.updateCamera({ c, canvas });

    if (this.isDev) {
      this.paintStates({c , msj:this.currentState.state, x:this.position.x-5, y:this.position.y-10});
      this.drawZone(c)
      this.collisionBlocks.forEach((collisionBlock) => {
        collisionBlock?.update(c);
      });
      //paint camera
      c.fillStyle = "#0ff00040";
      c.fillRect(this.camera.x, this.camera.y, this.camera.w, this.camera.h);
    
    
    }
  }
 
 
  updateCamera({ c, canvas }) {
   
     
    //!player is on the top
    this.shouldPanCameraUp();
    // !player is on the left

    this.shouldPanCameraToTheLeft({ canvas });
    // !player is on the right

    this.shouldPanCameraToTheRight({ canvas });

    // !player is on the bottom

    this.shouldPanCameraDown({ canvas });

    if (this.camera.isFollowing) {
      this.camera.x = this.position.x - this.camera.w / 2 + this.width / 2;
      this.camera.y = this.position.y - this.camera.h / 2 + this.height / 2;
    }
  }
  shouldPanCameraToTheLeft({ canvas }) {
    // Calcula el ancho movido basado en la posición actual de la cámara
    const movedWidth = Math.abs(this.camera.moveX);

    // Si el jugador se mueve hacia la derecha, salir de la función
    if (this.velocity.x >= 0) return;

    // Verifica si la cámara ha alcanzado el límite izquierdo visible
    if (this.camera.x <= movedWidth) {
      // Solo mueve la cámara si aún hay espacio en el mundo para moverse hacia la izquierda
      if (movedWidth > 0) {
        this.camera.moveX -= this.velocity.x; // Mueve la cámara en la dirección opuesta
      }
    }

    // camera.position.x -= this.velocity.x
  }

  shouldPanCameraToTheRight({ canvas }) {
    const movedWidth = canvas.width + Math.abs(this.camera.moveX);

    if (this.velocity.x <= 0) return;

    if (this.camera.x + this.camera.w >= movedWidth) {
      if (movedWidth < this.mundo.w) {
        this.camera.moveX -= this.velocity.x;
      }
    }
  }
  shouldPanCameraUp() {
    const movedHeight = Math.abs(this.camera.moveY);

    // Si el jugador se mueve hacia abajo, salir de la función
    if (this.velocity.y >= 0) return;

    // Verifica si la cámara ha alcanzado el límite superior visible
    if (this.camera.y <= movedHeight) {
      // Solo mueve la cámara si aún hay espacio en el mundo para moverse hacia arriba
      if (movedHeight > 0) {
        this.camera.moveY -= this.velocity.y; // Mueve la cámara hacia arriba
      }
    }
  }
  shouldPanCameraDown({ canvas }) {
    const movedHeight = canvas.height + Math.abs(this.camera.moveY);

    // Si el jugador se mueve hacia arriba, salir de la función
    if (this.velocity.y <= 0) return;

    // Verifica si la cámara ha alcanzado el límite inferior visible
    if (this.camera.y + this.camera.h >= movedHeight) {
      // Solo mueve la cámara si aún hay espacio en el mundo para moverse hacia abajo
      if (movedHeight < this.mundo.h) {
        this.camera.moveY -= this.velocity.y; // Mueve la cámara hacia abajo
      }
    }
  }

  input() {
    document.addEventListener("keydown", (event) => {
      this.currentState.handleKeyDown(event);

      this.keyPress = true;
    });
    document.addEventListener("keyup", (event) => {
      this.currentState.handleKeyUp(event);
      this.keyPress = false;
    });
  }
  onCollicioBlockHorizontalLeft(collisionBlock) {
    super.onCollicioBlockHorizontalLeft(collisionBlock);
   }
  onCollicioBlockHorizontalRight(collisionBlock) {
    super.onCollicioBlockHorizontalRight(collisionBlock);
  }
  onCollicioBlockVerticalTop(collisionBlock) {
    super.onCollicioBlockVerticalTop(collisionBlock);
  }
  onCollicioBlockVerticalBottom(collisionBlock) {
    super.onCollicioBlockVerticalBottom(collisionBlock);
  }

}

export default Player;