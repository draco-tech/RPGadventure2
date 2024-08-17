import { useEffect, useRef, useState } from "react";
import Player from "./js/Class";
import Background from "./js/background";

import useGameContext from "../../provider/context";
import Joystick from "./componentes/Joystick";

// const canvas = document.getElementById("canvas")

// let c = ""
// if (canvas)  c = canvas.getContext('2d')

// const mundo = new Background({position:{x:0,y:0}})
//     const player = new Player({ position:{x:440,y:240}})
const GameView = () => {
  const { mundo, player, isDev } = useGameContext();
  const [refreshWindos ,setRefreshWindos] = useState(false)

  const canvasRef = useRef(null);
  const requestIdRef = useRef(null);
  const lastTimeRef = useRef(0);


  function resizeCanvas() {
    setRefreshWindos(!refreshWindos)
    
    console.log('window.innerWidth',window.screen.width);

  }

  // Ajustar el tamaño del canvas al cargar la página
  window.addEventListener('load', resizeCanvas);

  // Ajustar el tamaño del canvas al redimensionar la ventana
  window.addEventListener('resize', resizeCanvas);






  useEffect(() => {
    const canvas = canvasRef.current;
    const c = canvas.getContext("2d");
    // canvas.width = 400;
    // canvas.height = 680;

    canvas.width = window.screen.width - 30;
    canvas.height = window.screen.height - 100;

    if (!canvas || !c) return;

    const animate = (timeStamp) => {
      const deltaTime = timeStamp - lastTimeRef.current;
      lastTimeRef.current = timeStamp;

      c.fillStyle = "black";
      c.fillRect(0, 0, canvas.width, canvas.height);

      mundo.update(c);
      player.update(c, deltaTime);
      player.updateCamera(c, mundo);

      requestIdRef.current = window.requestAnimationFrame(animate);
    };

    lastTimeRef.current = performance.now();
    requestIdRef.current = window.requestAnimationFrame(animate);

    // Limpiar el requestAnimationFrame en el desmontaje del componente




  




    return () => {
      if (requestIdRef.current) {
        window.cancelAnimationFrame(requestIdRef.current);
      }
    };
  }, [isDev,refreshWindos]); // Dependencia opcional; ajusta según tus necesidades

  return (
    <section style={{ position: "relative" }}>
      <canvas ref={canvasRef} className="card-container" id="canvas" />
      <Joystick {...{ player }} />
    </section>
  );
};

export default GameView;
