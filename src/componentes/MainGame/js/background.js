


class Background{
  constructor({position,image, imageWidth, imageHeight,resourse}){
    this.position = position
    this.image = new Image()
    this.scale = 1
    this.w = imageWidth * this.scale
    this.h = imageHeight * this.scale
    this.resourse = resourse
    this.image.src = image
    console.log('resourse',resourse);
    
    
  }
  update(c){
    this.draw(c)
    
  }
  draw(c){
  
    
    
    c.drawImage(this.image, this.position.x, this.position.y, this.w, this.h)
  }
}

export default Background