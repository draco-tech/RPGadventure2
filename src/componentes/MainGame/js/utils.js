import { CollisionBlockFull ,CollisionBlockLeft , CollisionBlockRight,CollisionBlockTop ,CollisionBlockBottom} from "./CollisionBlock"
const blockSize = 32 
export const parse2D = function (array) {
  const rows = []
  
  
  
  for (let i = 0; i < array.data.length; i += array.width) {
    rows.push(array.data.slice(i, i + array.width))
  }

  return rows
}

const typeBlocks = {
  collisionBlockFull:641,
   collisionBlockTop:654,
   collisionBlockLeft:642,
   collisionBlockRight:643,
   collisionBlockBottom:645,

 
}

export const createObjectsFrom2D = function (array) {
  const objects = []

  
  array.forEach((row, y) => {
    row.forEach((symbol, x) => {
      const { collisionBlockTop, collisionBlockLeft, collisionBlockRight, collisionBlockFull , collisionBlockBottom } = typeBlocks
      switch (symbol) {
        case collisionBlockTop:
          objects.push(
            new CollisionBlockTop({
              position: {
                x: x * blockSize,
                y: y * blockSize,
              },
            })
          )
          break;
        case collisionBlockLeft:
          objects.push(
            new CollisionBlockLeft({
              position: {
                x: x * blockSize,
                y: y * blockSize,
              },
            })
          )
          break;
        case collisionBlockFull:
          objects.push(
            new CollisionBlockFull({
              position: {
                x: x * blockSize,
                y: y * blockSize,
              },
            })
          )
          break;
          
        case collisionBlockRight:
          objects.push(
            new CollisionBlockRight({
              position: {
                x: x * blockSize,
                y: y * blockSize,
              },
            })
          )
          break;

        case collisionBlockBottom:
          objects.push(
            new CollisionBlockBottom({
              position: {
                x: x * blockSize,
                y: y * blockSize,
              },
            })
          )
          break;
      
        default:
          break;
      }













     
    })
  })

  return objects
}

export function checkForCollision({ object1, object2 }) {
  return (
    object1.y + object1.height > object2.position.y &&
    object1.y < object2.position.y + object2.height &&
    object1.x + object1.width > object2.position.x &&
    object1.x < object2.position.x + object2.width
  );
}