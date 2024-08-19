import { parse2D } from "./utils";
import imgData  from "/tailmap/Wall.png"


const TILE_SIZE = 32;
class Background{
  constructor({position,image ,resourse}){
    this.position = position
    this.image = new Image()
    this.scale = 1
    this.w = resourse.width * resourse.tilewidth *  this.scale
    this.h = resourse.height * resourse.tileheight *  this.scale
    this.resourse = resourse
    this.image.src = imgData
    this.layer = resourse.layers.map(layer => layer.data)
    this.frontPlayerField = resourse.layers.filter(layer => layer.name == "TopPlayer"  ||  layer.name == "TopPlayer2").map(layer =>  parse2D(layer))
   
    this.grassfield = [] //parse2D(resourse.layers.find(layer => layer.name == "Grass") )   //.filter(layer => {}));
    this.plantfield = []// parse2D(resourse.layers.find(layer => layer.name == "Plant") )  //.filter(layer => {}));
    this.allFiled =   resourse.layers.filter(layer => layer.name != "Collictions" &&  layer.name != "TopPlayer" &&  layer.name != "TopPlayer2" ).map(layer =>  parse2D(layer))
    this.collectionBlocks = parse2D(resourse.layers.find(layer => layer.name == "Collictions"))
    console.log('resourse.layers.',this.collectionBlocks);
    
    
    
    // console.log('resourse.layers.find(layer => layer.name == "grass")',resourse.layers.find(layer => layer.name == "grass"))
    this.tilesetImages = resourse.tilesets.map((item, index) => {
      const nextFirstGid = resourse.tilesets[index + 1]?.firstgid || null;
      const lastgid = nextFirstGid ? nextFirstGid - 1 : 9999;
       const image = new Image()
      image.src = "/tailmap/" + item.source.replace(/tsx$/, "png");
      return {
        source: item.source,
        firstgid: item.firstgid,
        lastgid: lastgid,
        image

       
      };
    });

    


    
  }
  update(c){
    this.draw(c)
    
     
    
    
    
  }
  drawGrassField(c) {
    //  this.drawTileMap({map:this.grassfield,c})
    //  this.drawTileMap({map:this.plantfield,c})
    this.allFiled.forEach((map) => {
      this.drawTileMap({map,c})
    })
     
  }
  drawFrontPlayer(c) {
    //this.frontPlayerField
   
    
    this.frontPlayerField.forEach((map) => {
      this.drawTileMap({map,c})
    })
    
  }


  drawTileMap({map,c}) {
    
    
    for (let row = 0; row < map.length; row++) {
      
      for (let col = 0; col < map[row].length; col++) {

        const gid = map[row][col];
        const tileset = this.tilesetImages.find(tileset => gid >= tileset.firstgid && gid <= tileset.lastgid);
        
        // console.log('tileset',tileset);
        
      
    
    //     // Encuentra el tileset correspondiente
    //     const tileset = this.tilesetImages.find(tileset => gid >= tileset.firstgid);
    //     console.log('tileset',tileset);
        
        if (tileset) {
          // console.log('tileset',tileset.image);
          
          // Calcula la posición del tile en el tileset
          const tileIndex = gid - tileset.firstgid;
          // console.log('gid',tileIndex);
          const tilesPerRow = Math.floor(tileset.image.width / TILE_SIZE);
          const sx = (tileIndex % tilesPerRow) * TILE_SIZE;
          const sy = Math.floor(tileIndex / tilesPerRow) * TILE_SIZE;
  
      //     // Dibuja el tile en la posición correcta en el canvas
      //
      // // console.log('tileset.image',tileset.);
        try {
          c.drawImage(
            tileset.image,
            sx, sy, TILE_SIZE, TILE_SIZE, // Posición del tile en el tileset
             col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE, TILE_SIZE // Posición en el canvas
          );
          
        } catch (error) {
          c.fillStyle = "#fff0ff60";
         c.fillRect(col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        }
         
        }
    }
  }

}
  
  draw(c){
  
    
    
    // c.drawImage(this.image, this.position.x, this.position.y, this.w, this.h)
  }
}

export default Background