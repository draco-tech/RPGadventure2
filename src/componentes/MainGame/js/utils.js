import { CollisionBlockFull ,CollisionBlockLeft , CollisionBlockRight,CollisionBlockTop ,CollisionBlockBottom, CollisionBlockCenter , CollisionBlockSqureLeftBottom , CollisionBlockSqureLeftTop, CollisionBlockSqureRightBottom, CollisionBlockSqureRightTop } from "./CollisionBlock"
const blockSize = 32 
export const parse2D = function (array) {
  const rows = []
  for (let i = 0; i < array.data.length; i += array.width) {
    rows.push(array.data.slice(i, i + array.width))
  }
  return rows
}
const blockElements = {
  collisionBlockFull:             { id: 641, classElement: CollisionBlockFull },
  collisionBlockTop:              { id: 642, classElement: CollisionBlockTop },
  collisionBlockLeft:             { id: 644, classElement: CollisionBlockLeft },
  collisionBlockRight:            { id: 645, classElement: CollisionBlockRight },
  collisionBlockBottom:           { id: 643, classElement: CollisionBlockBottom },
  collisionBlockCenter:           { id: 646, classElement: CollisionBlockCenter },
  collisionBlockSqureLeftBottom:  { id: 647, classElement: CollisionBlockSqureLeftBottom },
  collisionBlockSqureRightBottom: { id: 648, classElement: CollisionBlockSqureRightBottom },
  collisionBlockSqureLeftTop:     { id: 649, classElement: CollisionBlockSqureLeftTop },
  collisionBlockSqureRightTop:    { id: 650, classElement: CollisionBlockSqureRightTop }
};

export const createObjectsFrom2D = function (array) {
  const objects = [];

  array.forEach((row, y) => {
    row.forEach((symbol, x) => {
      for (const { id, classElement } of Object.values(blockElements)) {
        if (symbol === id) {
          objects.push(
            new classElement({
              position: {
                x: x * blockSize,
                y: y * blockSize,
              },
            })
          );
          break; // Salir del bucle una vez que se ha encontrado el bloque correspondiente
        }
      }
    });
  });

  return objects;
};


export function checkForCollision({ object1, object2 }) {
  return (
    object1.y + object1.height > object2.position.y &&
    object1.y < object2.position.y + object2.height &&
    object1.x + object1.width > object2.position.x &&
    object1.x < object2.position.x + object2.width
  );
}