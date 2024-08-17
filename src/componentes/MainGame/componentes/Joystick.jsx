import { useEffect, useRef } from "react";
import nipplejs from 'nipplejs';

const Joystick = ({player}) => {
 
  
  const joystickRef = useRef(null);

  
  

  useEffect(() => {
   
    
    if (joystickRef.current ) {
      const manager = nipplejs.create({
        zone: joystickRef.current,
        mode: 'dynamic',
        color: 'blue',
      });

      // Manejar eventos del joystick
      manager.on('move', (evt, data) => {
        const { angle } = data;

        if (angle) {
          
          
          const direction = angle.degree;
          player.velocity = {
            x:0,
            y:0
          }
          player.keyPress = true

          if (direction >= 45 && direction < 135) {
            player.velocity.y = -player.speed;
          } else if (direction >= 135 && direction < 225) {
            
            player.velocity.x = -player.speed;
          } else if (direction >= 225 && direction < 315) {
          
            player.velocity.y = player.speed;
          } else {
            
            player.velocity.x = player.speed;
          }
          
        }
      });

      manager.on('end', () => {
        player.velocity = {
          x:0,
          y:0
        }
        player.keyPress = false
      });

      // Cleanup cuando el componente se desmonte
      return () => {
        manager.destroy();
      };
    }
  }, []);

  return <div ref={joystickRef} style={{ width: '200px', height: '200px', border: '1px solid black',position:"absolute" ,bottom:'1px',right:"0px",backgroundColor:"#f0f00020"}} />;
};

export default Joystick; 