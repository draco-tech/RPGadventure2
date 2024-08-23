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
  collisionBlockFull:             { id: 577, classElement: CollisionBlockFull },
  collisionBlockTop:              { id: 578, classElement: CollisionBlockTop },
  collisionBlockBottom:           { id: 579, classElement: CollisionBlockBottom },
  collisionBlockLeft:             { id: 580, classElement: CollisionBlockLeft },
  collisionBlockRight:            { id: 581, classElement: CollisionBlockRight },
  collisionBlockCenter:           { id: 582, classElement: CollisionBlockCenter },
  collisionBlockSqureLeftBottom:  { id: 583, classElement: CollisionBlockSqureLeftBottom },
  collisionBlockSqureRightBottom: { id: 584, classElement: CollisionBlockSqureRightBottom },
  collisionBlockSqureLeftTop:     { id: 585, classElement: CollisionBlockSqureLeftTop },
  collisionBlockSqureRightTop:    { id: 586, classElement: CollisionBlockSqureRightTop }
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
    object1.position.y + object1.height > object2.position.y &&
    object1.position.y < object2.position.y + object2.height &&
    object1.position.x + object1.width > object2.position.x &&
    object1.position.x < object2.position.x + object2.width
  );
}



export  function detectCollisionCircle(circle1, circle2) {
  const dx = circle2.position.x - circle1.position.x;
  const dy = circle2.position.y - circle1.position.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  return distance <= circle1.radius + circle2.radius;
}


