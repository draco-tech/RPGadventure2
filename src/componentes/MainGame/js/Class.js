
class MainCharacter {
  constructor({position }){
    this.x = position.x;
    this.y = position.y
    this.width = 32
    this.height = 32
    this.speed = 2
    this.velocity ={
      x: 0,
      y: 0
    }
  }
  update(deltaTime) {
    this.checkCanvasBoundaries()
    this.playerIsMoved(deltaTime)
  }
   playerIsMoved(deltaTime){
    this.x += this.velocity.x // * deltaTime
    this.y += this.velocity.y //* deltaTime
  }
  checkCanvasBoundaries() {
    if (this.x  >= canvas.width - this.width  ) {
      this.x = canvas.width - this.width;
    } else if (this.x <= 0) {
      this.x = 0;
    }
    if (this.y >= canvas.height - this.height) {
      this.y = canvas.height - this.height;
    } else if (this.y <= 0) {
      this.y = 0;
    }
  }

 
}

class Player extends MainCharacter{

  constructor({position,isDev}){
    super({position})
   
    //  this.setupInput();
     this.camera = {
       x: this.x,
       y: this.y,
       w: 300,
       h: 300,
       isFollowing: true
     }
     this.keyPress =  false
     this.isDev = isDev
    
  }


  update(c,deltaTime){
    super.update(deltaTime)
   
    this.draw(c)
    
    
  }
 

  updateCamera(c,mundo) {
   
    if (this.isDev ){
    c.fillStyle = '#0ff00040'
    c.fillRect(this.camera.x, this.camera.y, this.camera.w, this.camera.h)
    }

    // !player is on the left
    if (this.x - this.camera.w / 2 - this.width / 2 < 0 ) {
      if (mundo.position.x < 0){
        if (this.keyPress ) {
          
        mundo.position.x += this.speed
        }
        this.x = this.camera.x + this.camera.w / 2  - this.width / 2
      }
     
      
    }

    // !player is on the top
    // if (this.y > this.camera.y + this.camera.h / 2) {
    //   this.camera.isFollowing = true
    // }
    if (this.camera.y < 0) {
      this.camera.y = 0
      if (mundo.position.y < 0){
        if (this.keyPress ) {
        mundo.position.y += this.speed
        }
        this.y = this.camera.y + this.camera.h / 2  - this.height / 2 - this.height / 2 +  6
        if (mundo.position.x < 0){
          if (this.keyPress ) {
          mundo.position.y += this.speed
          }
          this.y = this.camera.y + this.camera.h / 2  - this.height / 2 
        }
      }
    }
    if (this.y > this.camera.y + this.camera.h / 2) {
      this.camera.isFollowing = true
    }
    // !player is on the right
    if (this.x + this.camera.w / 2 + this.width / 2  >=  canvas.width ) {
     
     if (mundo.position.x > -mundo.w + canvas.width + 6){
      this.x =  canvas.width - this.camera.w /2 - this.width / 2
     }
      if (this.keyPress ) {
      if (mundo.position.x > -mundo.w + canvas.width + 6){

        if (this.velocity.x != 0 || this.velocity.y != 0){
        mundo.position.x -= this.speed
        }
      }
     }

    }

    // !player is on the bottom
    if (this.y + this.camera.h / 2 + this.height / 2 >=  canvas.height ) {

      if (mundo.position.y > -mundo.h + canvas.height + 6){
      this.y =  canvas.height - this.camera.h / 2 - this.height / 2
      }
      if (this.keyPress ) {
        if (mundo.position.y > -mundo.h + canvas.height + 6){

          
          mundo.position.y -= this.speed
          
        }
       }
    }
   

    
    if (this.camera.isFollowing) {
      this.camera.x = this.x - (this.camera.w / 2) + (this.width / 2 )
      this.camera.y = this.y - (this.camera.h / 2)  + (this.height / 2)
    }

   


  }


  draw(c){
    c.fillStyle = 'blue'
    c.fillRect(this.x, this.y, this.width, this.height)
  }
  setupInput() {
    // Bind keydown and keyup events to the Player class
    // document.addEventListener('keydown', this.handleKeyDown.bind(this));
    // document.addEventListener('keyup', this.handleKeyUp.bind(this));
  }
  handleKeyDown(event) {
    switch(event.key) {
      case 'ArrowUp':
        this.velocity.y = -this.speed;
        break;
      case 'ArrowDown':
        this.velocity.y = this.speed;
        break;
      case 'ArrowLeft':
        this.velocity.x = -this.speed;
        break;
      case 'ArrowRight':
        this.velocity.x = this.speed;
        break;
    }
    this.keyPress = true
  }

  handleKeyUp(event) {
    switch(event.key) {
      case 'ArrowUp':
      case 'ArrowDown':
        this.velocity.y = 0;
        break;
      case 'ArrowLeft':
      case 'ArrowRight':
        this.velocity.x = 0;
        break;
    }
    this.keyPress = false
  }
}

export default Player