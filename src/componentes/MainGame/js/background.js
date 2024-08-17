//3840 × 1920


class Background{
  constructor({position}){
    this.position = position
    this.image = new Image()
    this.w = 3840
    this.h = 1920
    this.image.src = "/img/map0.bmp"
    
  }
  update(c){
    this.draw(c)
  }
  draw(c){
  
    
    
    c.drawImage(this.image, this.position.x, this.position.y, this.w, this.h)
  }
}

export default Background