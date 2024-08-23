
import Background from "./background";


import mundo0 from "../../../tiled/mapaGia.json";
import mundo2 from "../../../tiled/mapaGia2.json";
import mundo3 from "../../../tiled/mapaGia3.json";
import bigWorld from "../../../tiled/bigWordl.json";
import { player } from "../../../provider/context";





export class MainGame {
  static indexWordl = 0

  constructor({isDev}) { 
  
    
    this.allAviledWords = [
      new Background({playerPosition:{x:32,y:64},resourse:bigWorld} ),
      // new Background({playerPosition:{x:122,y:64},resourse:mundo2} ),
      // new Background({playerPosition:{x:32,y:364},resourse:mundo3} ),  
    
    ]
    
    this.currentWorldIndex = 0
    this.currentWorld = this.allAviledWords[this.currentWorldIndex]
    this.isDev = isDev

    this.entities = [];
    this.canvas = null;
  }
  addEntity(entity) {
    this.entities.push(entity);
  }
  update(c,deltaTime) {
    this.entities
    .sort((a , b ) => a.position.y - b.position.y )  
    .forEach((entity) => {
      entity.mundo = this.currentWorld
      entity.isDev = this.isDev
      entity.update(c, deltaTime ,  this.entities ,this.canvas,);
    })
  }
   changeWorldIndex() {
    if (this.currentWorldIndex + 1 > this.allAviledWords.length - 1) {
      this.currentWorldIndex = 0

    } else {
      MainGame.indexWordl += 1
   
    }
    console.log('this.allAviledWords.length',this.allAviledWords.length);
    console.log('this.currentWorldIndex',this.currentWorldIndex);
    
    this.currentWorld = this.allAviledWords[this.currentWorldIndex]
 
   
    
   
  }
  


}