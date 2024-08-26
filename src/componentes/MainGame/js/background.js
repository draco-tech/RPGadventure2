import { createObjectsFrom2D, parse2D } from "./utils";
import imgData from "/tailmap/Wall.png";

// Layers: Grass - Shadows  - Walls - Plants - TopPlayer - TopPlayer2 - Collictions
class Background {
  constructor({ resourse }) {
    this.position = {
      x: 0,
      y: 0,
    };
    this.TILE_SIZE = 32;
    this.image = new Image();
    this.scale = 1;
    this.w = resourse.width * resourse.tilewidth * this.scale;
    this.h = resourse.height * resourse.tileheight * this.scale;
    this.resourse = resourse;
    this.image.src = imgData;
    this.frontPlayerField = ["TopPlayer", "TopPlayer2"];
    this.interactiveField = ["Collictions"];
    this.allFiledFileds = [...this.frontPlayerField, ...this.interactiveField];

    this.frontPlayerFielter = makeDifferntsLayers({
      layers: resourse.layers,
      namesLayer: this.frontPlayerField,
    });
    this.collectionBlocks = createObjectsFrom2D(
      makeONELayer({
        layers: resourse.layers,
        name: "Collictions",
      })
    );

    this.allFiledFilter = makeDifferntsLayers({
      layers: resourse.layers,
      namesLayer: this.allFiledFileds,
      all: true,
    });

    this.tilesetImages = resourse.tilesets.map((item, index) => {
      const nextFirstGid = resourse.tilesets[index + 1]?.firstgid || null;
      const lastgid = nextFirstGid ? nextFirstGid - 1 : 9999;
      const image = new Image();
      image.src = "/tailmap/" + item.source.replace(/tsx$/, "png");
      return {
        source: item.source,
        firstgid: item.firstgid,
        lastgid: lastgid,
        image,
      };
    });
  }
  update(c) {}
  drawGrassField(c) {
    this.allFiledFilter.forEach((map) => {
      this.drawTileMap({ map, c });
    });
  }
  drawFrontPlayer(c) {
    this.frontPlayerFielter.forEach((map) => {
      this.drawTileMap({ map, c });
    });
  }

  drawTileMap({ map, c }) {
    for (let row = 0; row < map.length; row++) {
      for (let col = 0; col < map[row].length; col++) {
        const gid = map[row][col];
        const tileset = this.tilesetImages.find(
          (tileset) => gid >= tileset.firstgid && gid <= tileset.lastgid
        );

        if (tileset) {
          const tileIndex = gid - tileset.firstgid;
          const tilesPerRow = Math.floor(tileset.image.width / this.TILE_SIZE);
          const sx = (tileIndex % tilesPerRow) * this.TILE_SIZE;
          const sy = Math.floor(tileIndex / tilesPerRow) * this.TILE_SIZE;

          try {
            c.drawImage(
              tileset.image,
              sx,
              sy,
              this.TILE_SIZE,
              this.TILE_SIZE, // Posición del tile en el tileset
              col * this.TILE_SIZE,
              row * this.TILE_SIZE,
              this.TILE_SIZE,
              this.TILE_SIZE // Posición en el canvas
            );
          } catch (error) {
            c.fillStyle = "#fff0ff60";
            c.fillRect(
              col * this.TILE_SIZE,
              row * this.TILE_SIZE,
              this.TILE_SIZE,
              this.TILE_SIZE
            );
          }
        }
      }
    }
  }
}

export default Background;

function makeONELayer({ layers, name }) {
  return parse2D(layers.find((layer) => layer.name == name));
}
function makeDifferntsLayers({ layers, namesLayer, all = false }) {
  return layers
    .filter((layer) =>
      all ? !namesLayer.includes(layer.name) : namesLayer.includes(layer.name)
    )
    .map((layer) => parse2D(layer));
}
