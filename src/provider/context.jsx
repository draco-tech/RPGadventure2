import { createContext, useContext, useEffect, useState } from "react";

import io from "socket.io-client";
import Background from "../componentes/MainGame/js/background";
import { MainGame } from "../componentes/MainGame/js/gameClass";
import Player from "../componentes/MainGame/js/Player";
import Pokemon from "../componentes/MainGame/js/pokemon/Pokemon.js";
import { NPC } from "../componentes/MainGame/js/npc/NPC";
import PlayerOf from "../componentes/MainGame/js/playerOf/playerOf";

// import mundo0 from "../js/colictions/colictions.json";
const socket = io("http://localhost:3000/");
export const ramdomePosition = () => {
  return {
    x: Math.floor(Math.random() * 60) * 32,
    y: Math.floor(Math.random() * 40) * 32,
  };
};

const bulbasaur = {
  position: ramdomePosition(),
  allimages: ["001", "002", "003"],
  tag: "bulbasaur",
};
const charmander = {
  position: ramdomePosition(),
  allimages: ["004", "005", "006"],
  tag: "charmander",
};
const squirtle = {
  position: ramdomePosition(),
  allimages: ["007", "008", "009"],
  tag: "squirtle",
};
const caterpie = {
  position: ramdomePosition(),
  allimages: ["010", "011", "012"],
  tag: "caterpie",
};
const weedler = {
  position: ramdomePosition(),
  allimages: ["013", "014", "015"],
  tag: "weedler",
};
const pidgey = {
  position: ramdomePosition(),
  allimages: ["016", "017", "018"],
  tag: "pidgey",
};
const ratata = {
  position: ramdomePosition(),
  allimages: ["019", "020"],
  tag: "ratata",
};
const spearow = {
  position: ramdomePosition(),
  allimages: ["021", "022"],
  tag: "spearow",
};
const ekans = {
  position: ramdomePosition(),
  allimages: ["023", "024"],
  tag: "ekans",
};
const pikachu = {
  position: ramdomePosition(),
  allimages: ["025", "026"],
  tag: "pikachu",
};

const GameContext = createContext({});

const metroidStup = {
  position: { x: 64, y: 134 },
  img: "public/enemy/larvaMetroid.png",
  frameWidth: 120,
  frameHeight: 120,
  maxFrame: 4,
  tag: "metroid",
};
//ramdomePosition()
export const player = new Player({ position: { x: 164, y: 164 } });

const allEntentys = [
  player,

  // new Pokemon(bulbasaur),
  // new Pokemon(charmander),
  // new Pokemon(squirtle),
  // new Pokemon(caterpie),
  // new Pokemon(weedler),
  // new Pokemon(pidgey),
  // new Pokemon(ratata),
  // new Pokemon(spearow),
  // new Pokemon(ekans),
  // new Pokemon(pikachu),
  // new NPC(metroidStup),
  // new PlayerOf({
  //   position: { x: 164, y: 164 },
  //   socketID: "no avile",
  // }),
];

const game = new MainGame({ isDev: true });

allEntentys.forEach((entity) => {
  game.addEntity(entity);
});

const gameData = {
  width: game.currentWorld.w,
  height: game.currentWorld.h,
  collectionBlocks: game.currentWorld.collectionBlocks,
};

fetch("http://localhost:4000/map", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(gameData),
})
  .then((response) => response.text())
  .then((data) => console.log(data))
  .catch((error) => console.error("Error:", error));

export const GameContextProvider = ({ children }) => {
  const [isDev, setIsDev] = useState(true);

  const changeMundo = () => {};

  useEffect(() => {
    player.input();
  }, []);

  useEffect(() => {
    game.isDev = isDev;

    player.speed = isDev ? 5 : 2;
  }, [isDev]);
  if (true) {
    socket.on("start", (data) => {
      console.log(player.socketID);

      player.socketID = socket.id;
      player.socket = socket;
      socket.emit("find", { socketID: socket.id, position: player.position });
    });
    socket.on("allplayers", (allData) => {
      allData.forEach((entity) => {
        // Verificar que no sea el mismo socket.id
        if (entity.socketID !== socket.id) {
          // Verificar que el socketID no esté ya en game.entities
          const entityExists = game.entities.some(
            (pla) => pla.socketID === entity.socketID
          );

          // Si no existe, crear una nueva instancia
          if (!entityExists) {
            const npc = new PlayerOf({
              position: entity.position,
              socketID: entity.socketID,
              keyPress: entity.keyPress,
            });
            game.addEntity(npc);
          }
        }
      });
    });
    function interpolate(entity, targetPosition, deltaTime) {
      entity.position.x += (targetPosition.x - entity.position.x) * deltaTime;
      entity.position.y += (targetPosition.y - entity.position.y) * deltaTime;
    }

    socket.on("update", (updatedEntities) => {
      updatedEntities.forEach((updatedEntity) => {
        const entity = game.entities.find(
          (e) => e.socketID === updatedEntity.socketID
        );
        if (entity && entity.socketID !== socket.id) {
          interpolate(entity, updatedEntity.position, 0.05); // 0.1 es un factor de interpolación
          // entity.position.x = updatedEntity.position.x;
          // entity.position.y = updatedEntity.position.y;

          entity.lastDirection = updatedEntity.lastDirection;
          entity.flipToLeft =
            updatedEntity.lastDercion === "left" ? true : false;
          entity.keyPress = updatedEntity.keyPress;
        }
      });
    });
    socket.on("updateEntety", (dataEntey) => {
      dataEntey.forEach((updatedEntity) => {
        const entity = game.entities.find(
          (e) => e.socketID === updatedEntity.id
        );
        entity.position = updatedEntity.position;
      });

      // console.log(dataEntey, "data");
    });

    socket.once("addEntity", (allDataE) => {
      console.log("entity", allDataE);
      allDataE.forEach((entity) => {
        // Verificar que el socketID no esté ya en game.entities
        const entityExists = game.entities.some(
          (pla) => pla.socketID === entity.socketID
        );

        // Si no existe, crear una nueva instancia
        if (!entityExists) {
          const npc = new PlayerOf({
            position: entity.position,
            socketID: entity.id,
          });
          game.addEntity(npc);
        }
      });
    });

    socket.on("removePlayer", (id) => {
      const entities = game.entities.filter((entity) => entity.socketID !== id);
      game.entities = entities;
    });
  }

  const value = {
    hola: "jjja",
    player,
    game,
    setIsDev,
    isDev,
    changeMundo,
  };
  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

const useGameContext = () => useContext(GameContext);

export default useGameContext;
