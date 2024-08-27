import Background from "./background";

import mundo0 from "../../../tiled/mapaGia.json";
import mundo2 from "../../../tiled/mapaGia2.json";
import mundo3 from "../../../tiled/mapaGia3.json";
import bigWorld from "../../../tiled/bigWordl.json";
import { NPC } from "./npc/NPC";

export class MainGame {
  static indexWordl = 0;

  constructor({ isDev }) {
    this.allAviledWords = [
      new Background({ playerPosition: { x: 32, y: 64 }, resourse: bigWorld }),
      // new Background({playerPosition:{x:122,y:64},resourse:mundo2} ),
      // new Background({playerPosition:{x:32,y:364},resourse:mundo3} ),
    ];

    this.currentWorldIndex = 0;
    this.currentWorld = this.allAviledWords[this.currentWorldIndex];
    this.isDev = isDev;

    this.entities = [];
    this.canvas = null;
    this.player = this.entities.find((entity) => entity.tag == "player");
    this.addNewElement();

    // setInterval(() => {
    //   let pkm = new Pokemon({...caterpie,position: {x: Math.floor(Math.random() * 60) * 32, y: Math.floor(Math.random() * 40) * 32}})
    //   this.addEntity(pkm);
    //   console.log('new caterpie',pkm.position);
    // },3000)
  }
  addEntity(entity) {
    this.entities.push(entity);
  }
  paintGUI({ c, msj, x, y }) {
    c.font = "16px Arial"; // Tamaño y fuente del texto
    c.fillStyle = "blue"; // Color del texto

    // Escribir el texto en el canvas
    c.fillText(msj, x, y); // Texto, posición x, posición y

    // Opcional: añadir bordes al texto
    c.strokeStyle = "black"; // Color del borde
    c.lineWidth = 1; // Ancho del borde
    c.strokeText(msj, x, y); // Texto, posición x, posición y
  }
  update(c, deltaTime) {
    this.entities = this.entities.filter((entitie) => !entitie.isDead);
    this.entities
      .sort((a, b) => a.position.y - b.position.y)
      .forEach((entity) => {
        entity.mundo = this.currentWorld;
        entity.isDev = this.isDev;
        entity.isMultiplayer = this.isMultiplayer;
        entity.update(c, deltaTime, this.entities, this.canvas);
      });
  }
  changeWorldIndex() {
    if (this.currentWorldIndex + 1 > this.allAviledWords.length - 1) {
      this.currentWorldIndex = 0;
    } else {
      MainGame.indexWordl += 1;
    }

    this.currentWorld = this.allAviledWords[this.currentWorldIndex];
  }
  addNewElement() {
    setInterval(() => {
      const oldElement = this.entities.filter(
        (entity) => entity.tag !== "player"
      );

      if (oldElement.length < 3) {
        let newNPC = new NPC({
          position: {
            x: Math.floor(Math.random() * 60) * 32,
            y: Math.floor(Math.random() * 40) * 32,
          },
        });
        this.addEntity(newNPC);
        console.log("new NPC", newNPC.position);
      }
    }, 60000);
  }
  searchElement() {
    // Add a click event listener to the canvas
    document.addEventListener("click", (event) => {
      // Obtener la posición del clic relativa al canvas

      const rect = canvas?.getBoundingClientRect();
      const x = event.clientX - rect.left + Math.abs(this.player.camera.moveX);
      const y = event.clientY - rect.top + Math.abs(this.player.camera.moveY);

      let npcFound = false;

      // Iterar a través de los NPCs para verificar si alguno está en la posición clicada
      this.entities.forEach((npc) => {
        if (
          x >= npc.position.x &&
          x <= npc.position.x + npc.width && // Asumiendo que NPC tiene una propiedad width
          y >= npc.position.y &&
          y <= npc.position.y + npc.height // Asumiendo que NPC tiene una propiedad height
        ) {
          console.log(`NPC found at `, npc);
          npcFound = true;
        }
      });

      // Si no se encontró ningún NPC, agregar un nuevo Pokémon
      if (!npcFound) {
        // console.log('new Pokemon', { x, y });
        // this.addEntity(new Pokemon({ ...caterpie, position: { x, y } }));
      }
    });
  }
}
