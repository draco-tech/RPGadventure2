import { useEffect, useRef, useState } from "react";
import Player from "./js/Class";
import Background from "./js/background";
import img from "..\/..\/..\/..\/..\/tiledmap\/TX Tileset Grass.png"      //"../../../../../tiledmap/TX Plant.png";

import useGameContext from "../../provider/context";
import Joystick from "./componentes/Joystick";
import { mundo0 } from "./js/colictionInfo";
import { createObjectsFrom2D, parse2D } from "./js/utils";


let parsedCollisions = []
let collisionBlocks = []



const GameView = () => {
  const { mundo, player, isDev } = useGameContext();
  const [refreshWindos ,setRefreshWindos] = useState(false)
  const [orientation, setOrientation] = useState(window.screen.orientation.type);

  const canvasRef = useRef(null);
  const requestIdRef = useRef(null);
  const lastTimeRef = useRef(0);


  function resizeCanvas() {
    setOrientation(window.screen.orientation.type);
    setRefreshWindos(!refreshWindos)
    
  }

  // Ajustar el tamaño del canvas al cargar la página
  window.addEventListener('load', resizeCanvas);

  // Ajustar el tamaño del canvas al redimensionar la ventana
  window.addEventListener('resize', resizeCanvas);

    // Agregar el listener para detectar cambios de orientación
    window.addEventListener('orientationchange', resizeCanvas);

    


  useEffect(() => {
    const canvas = canvasRef.current;
    const c = canvas.getContext("2d");
    parsedCollisions = parse2D(mundo0)
    collisionBlocks = createObjectsFrom2D(parsedCollisions)
      
      player.collisionBlocks = collisionBlocks
      player.mundo = mundo
    
    
    canvas.width =  window.outerWidth - 30;
    canvas.height =  window.outerHeight - 50;

  

    if (!canvas || !c) return;

    const animate = (timeStamp) => {
      const deltaTime = timeStamp - lastTimeRef.current;
      lastTimeRef.current = timeStamp;

      c.fillStyle = "black";
      c.fillRect(0, 0, canvas.width, canvas.height);
     
      
     
       c.save()
        // c.scale(2, 2)
     
       c.translate(player.camera.moveX, player.camera.moveY)
      //  c.translate(camera.position.x, camera.position.y)
       mundo.update(c);
      
      
      if (isDev) {
      collisionBlocks.forEach((collisionBlock) => {
        collisionBlock?.update(c);
      });
     
    }

    player.update({c, deltaTime,mapa:mundo,canvas});
       c.restore()

       requestIdRef.current = window.requestAnimationFrame(animate);

      

    };

    lastTimeRef.current = performance.now();
    requestIdRef.current = window.requestAnimationFrame(animate);

    




  




    return () => {
      // Ajustar el tamaño del canvas al redimensionar la ventana
  window.addEventListener('resize', resizeCanvas);
      if (requestIdRef.current) {
        window.cancelAnimationFrame(requestIdRef.current);
      }
    };
  }, [isDev,refreshWindos,orientation]); // Dependencia opcional; ajusta según tus necesidades

  return (
    <section style={{ position: "relative" }}>

     
      <img src={img} alt="dd" />
      <canvas ref={canvasRef} className="card-container" id="canvas" />
      <Joystick {...{ player }} />
    </section>
  );
};

export default GameView;
