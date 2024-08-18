import { CollisionBlockFull ,CollisionBlockLeft , CollisionBlockRight,CollisionBlockTop} from "./CollisionBlock"
const blockSize = 32 
export const parse2D = function (array) {
  const rows = []
  for (let i = 0; i < array.length; i += 120) {
    rows.push(array.slice(i, i + 120))
  }

  return rows
}

export const createObjectsFrom2D = function (array) {
  const objects = []
  array.forEach((row, y) => {
    row.forEach((symbol, x) => {
      switch (symbol) {
        case 1:
          objects.push(
            new CollisionBlockTop({
              position: {
                x: x * blockSize,
                y: y * blockSize,
              },
            })
          )
          break;
        case 2:
          objects.push(
            new CollisionBlockLeft({
              position: {
                x: x * blockSize,
                y: y * blockSize,
              },
            })
          )
          break;
        case 3:
          objects.push(
            new CollisionBlockFull({
              position: {
                x: x * blockSize,
                y: y * blockSize,
              },
            })
          )
          break;
          
        case 4:
          objects.push(
            new CollisionBlockRight({
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