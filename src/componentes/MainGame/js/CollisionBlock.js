 
 const blockSize = 32
 
 class CollisionBlock {
  constructor({ position , color ,width , height , moveX = 0 , moveY = 0}) {
    this.position ={
      x: position.x + moveX,
      y: position.y + moveY
    } 
    this.scale = 1
   
    this.color = color 
    this.width = width * this.scale
    this.height = height * this.scale
    this.moveX = moveX
    

  }

  update(c) {
    this.draw(c)
   
  }

  draw(c) {
    c.fillStyle = this.color
    c.fillRect( this.position.x, this.position.y, this.width, this.height)
  }
}

export class CollisionBlockFull extends CollisionBlock {
  constructor({ position }) {
    super({ position,color:'rgba(255, 0, 0, 0.5)', width: blockSize, height: blockSize })
    

  }
} 

export class CollisionBlockLeft extends CollisionBlock {
  constructor({ position }) {
    super({ position,color:'rgba(100, 5, 67, 0.5)', width: 8, height: blockSize })
    

  }
} 
export class CollisionBlockRight extends CollisionBlock {
  constructor({ position }) {
    super({ position,color:'rgba(00, 05, 67, 0.5)', width: 8, height: blockSize,moveX:24 })
    

  }
}
export class CollisionBlockTop extends CollisionBlock {
  constructor({ position }) {
    super({ position,color:'rgba(200, 035, 37, 0.5)', width: blockSize, height: 8, moveY:0 })
    

  }
}