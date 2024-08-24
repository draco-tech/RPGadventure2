import { NPC } from "../Class";

import { PKM_CHASE, PKM_IDLE, PKM_PATROL } from "./pokemonStaes";


export  class Pokemon extends NPC {
  constructor({ position, img, frameWidth = 178, frameHeight= 178 }) {
    super({
      position,
      img,
      frameWidth,
      frameHeight,
      tag: "pokemon",
      allstates: [PKM_IDLE, PKM_PATROL, PKM_CHASE],
    })
    this.position = position;
    this.img = img;
    this.frameWidth = frameWidth;
    this.frameHeight = frameHeight;
     //maxFrame;
     this.frameX = 1;
     this.frameY = 2
    this.selectedFrameY = 2 ;
    this.maxFrame = this.frameY + 1
    this.radius = 50; // NPC_IDLE, NPC_PATROL, NPC_CHASE  //
    this.tag = "enemy";
    this.speed = 2;
    this.isDev = false;
    this.fps = 14;
    this.timeOfInterval = 4000;
    this.frameInterval = this.timeOfInterval  / this.fps;
    console.log(' this.states', this.states);
    

  }
  update(c, deltaTime, entities) {
    super.update(c, deltaTime, entities);
    
    
  }
  flipSprite(dirección) {
    switch (dirección) {
      case "left": 
      this.frameX = 1;
      this.frameY = 0
      this.selectedFrameY = 0 ;
      break;
      case "up": 
      this.frameX = 0;
      this.frameY = 0
     this.selectedFrameY = 0 ;
      break;
      case "down": 
      this.frameX = 0;
     this.frameY = 2
    this.selectedFrameY = 2 ;
      break;
      case "right": 
      this.frameX = 1;
     this.frameY = 2
      this.selectedFrameY = 2 
      break;
      default:
        return;
    }
  } 
  drawSprite(c,deltaTime) {
    //sprrite animation
    if (this.frameTime > this.frameInterval) {
      this.frameTime = 0;
      if (this.frameY < this.maxFrame) this.frameY++;
      else this.frameY = this.selectedFrameY;
    } else this.frameTime += deltaTime;
   

    // Ajustar la posición en X para que la imagen se pinte correctamente si está invertida
    c.drawImage(
      this.sprite,
      this.frameX * this.frameWidth,
      this.frameY * this.frameHeight,
      this.frameWidth,
      this.frameHeight,
      this.position.x - this.sizeSprite / 5, // Posición normal
      this.position.y - this.sizeSprite / 5 - 8,
      this.sizeSprite,
      this.sizeSprite
    );



  }  
}