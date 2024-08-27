import { useEffect, useRef, useState } from "react";

import useGameContext from "../../provider/context";
import Joystick from "./componentes/Joystick";

const GameView = () => {
  const { game, isDev, player } = useGameContext();
  const [refreshWindos, setRefreshWindos] = useState(false);
  const [orientation, setOrientation] = useState(
    window.screen.orientation.type
  );

  const canvasRef = useRef(null);
  const requestIdRef = useRef(null);
  const lastTimeRef = useRef(0);

  function resizeCanvas() {
    setOrientation(window.screen.orientation.type);
    setRefreshWindos(!refreshWindos);
  }

  // Ajustar el tamaño del canvas al cargar la página
  window.addEventListener("load", resizeCanvas);

  // Ajustar el tamaño del canvas al redimensionar la ventana
  window.addEventListener("resize", resizeCanvas);

  // Agregar el listener para detectar cambios de orientación
  window.addEventListener("orientationchange", resizeCanvas);

  useEffect(() => {
    const canvas = canvasRef.current;
    const c = canvas.getContext("2d");

    canvas.width = window.outerWidth - 30;
    canvas.height = window.outerHeight - 50;

    if (!canvas || !c) return;
    game.canvas = canvas;
    const animate = (timeStamp) => {
      const deltaTime = timeStamp - lastTimeRef.current;
      lastTimeRef.current = timeStamp;

      c.fillStyle = "black";
      c.fillRect(0, 0, canvas.width, canvas.height);

      c.save();
      // c.scale(2, 2)

      c.translate(player.camera.moveX, player.camera.moveY);

      // mundo.drawGrassField(c);
      game.currentWorld.drawGrassField(c);
      game.update(c, deltaTime);
      //  player.update({ c, deltaTime, canvas });
      game.currentWorld.drawFrontPlayer(c);

      c.restore();
      game.paintGUI({
        c,
        msj: "Live",
        x: 64,
        y: 30,
      });
      player.paintLive(c, 120, 14);
      game.paintGUI({
        c,
        msj: "killed " + player.enemiesKilles,
        x: 64,
        y: 60,
      });

      requestIdRef.current = window.requestAnimationFrame(animate);
    };

    lastTimeRef.current = performance.now();
    requestIdRef.current = window.requestAnimationFrame(animate);

    return () => {
      // Ajustar el tamaño del canvas al redimensionar la ventana
      window.addEventListener("resize", resizeCanvas);
      if (requestIdRef.current) {
        window.cancelAnimationFrame(requestIdRef.current);
      }
    };
  }, [isDev, refreshWindos, orientation]); // Dependencia opcional; ajusta según tus necesidades

  return (
    <section style={{ position: "relative" }}>
      <canvas ref={canvasRef} className="card-container" id="canvas" />
      <Joystick {...{ player }} />
    </section>
  );
};

export default GameView;
