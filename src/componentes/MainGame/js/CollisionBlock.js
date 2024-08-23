 class Block{
  constructor({ position  ,width = 32 , height = 32 , moveX = 0 , moveY = 0}) {
    this.position ={
      x: position.x + moveX,
      y: position.y + moveY
    } 
    this.scale = 1
    
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
 class CollisionBlock extends Block {
  constructor({ position  ,width , height , moveX = 0 , moveY = 0}) {
    super({ position  ,width , height , moveX , moveY})
    this.color = 'rgba(255, 0, 0, 0.5)'
    this.tag = 'collisionBlock'
  
    

  }

 
}

export class CollisionBlockFull extends CollisionBlock {
  constructor({ position }) {
    super({ position})
    

  }
} 

export class CollisionBlockLeft extends CollisionBlock {
  constructor({ position }) {
    super({ position, width: 8})
    

  }
} 
export class CollisionBlockRight extends CollisionBlock {
  constructor({ position }) {
    super({ position, width: 8,moveX:24 })
    

  }
}
export class CollisionBlockTop extends CollisionBlock {
  constructor({ position }) {
    super({ position, height: 8 })
    

  }
}

export class CollisionBlockBottom extends CollisionBlock {
  constructor({ position }) {
    super({ position, height: 8, moveY:24 })
    

  }
}
export class CollisionBlockCenter extends CollisionBlock {
  constructor({ position }) {
    super({ position, width: 8, moveX:12 })
    

  }
}
export class CollisionBlockSqureLeftBottom extends CollisionBlock {
  constructor({ position }) {
    super({ position, width: 8, height: 8,moveY:24  })
    

  }
}
export class CollisionBlockSqureLeftTop extends CollisionBlock {
  constructor({ position }) {
    super({ position, width: 8, height: 8  })
    

  }
}
export class CollisionBlockSqureRightBottom extends CollisionBlock {
  constructor({ position }) {
    super({ position, width: 8, height: 8,moveX:24, moveY:24  })
    

  }
}
export class CollisionBlockSqureRightTop extends CollisionBlock {
  constructor({ position }) {
    super({ position, width: 8, height: 8,moveX:24   })
    

  }
}



// collisionBlockCenter