import { useEffect, useRef } from "react";
import nipplejs from "nipplejs";
import useGameContext, { player } from "../../../provider/context";

const Joystick = () => {
  const { isDev } = useGameContext();

  const joystickRef = useRef(null);

  useEffect(() => {
    if (joystickRef.current) {
      let lastDercion = "";
      const manager = nipplejs.create({
        zone: joystickRef.current,
        mode: "dynamic",
        color: "blue",
      });

      // Manejar eventos del joystick
      manager.on("move", (evt, data) => {
        const { angle } = data;

        if (angle) {
          const direction = angle.degree;
          player.velocity = {
            x: 0,
            y: 0,
          };

          player.keyPress = true;

          if (direction >= 45 && direction < 135) {
            //* Dirección hacia arriba

            lastDercion = "top";
            player.currentState.handleKeyDown({ key: "ArrowUp" });
          } else if (direction >= 135 && direction < 225) {
            //* Dirección hacia la izquierda
            lastDercion = "left";
            player.currentState.handleKeyDown({ key: "ArrowLeft" });
          } else if (direction >= 225 && direction < 315) {
            //* Dirección hacia abajo
            lastDercion = "down";
            player.currentState.handleKeyDown({ key: "ArrowDown" });
          } else {
            lastDercion = "right";
            player.velocity.x = player.speed;
            //* Dirección hacia la derecha

            player.currentState.handleKeyDown({ key: "ArrowRight" });
          }
        }
      });

      manager.on("end", () => {
        player.velocity = {
          x: 0,
          y: 0,
        };
        player.keyPress = false;

        switch (lastDercion) {
          case "top":
            player.currentState.handleKeyUp({ key: "ArrowUp" });
            break;
          case "left":
            player.currentState.handleKeyUp({ key: "ArrowLeft" });
            break;
          case "down":
            player.currentState.handleKeyUp({ key: "ArrowDown" });
            break;
          case "right":
            player.currentState.handleKeyUp({ key: "ArrowRight" });
            break;
        }
      });

      // Cleanup cuando el componente se desmonte
      return () => {
        manager.destroy();
      };
    }
  }, [isDev]);

  return (
    <div
      ref={joystickRef}
      className={`joystick-area   ${isDev ? "joystick-area-dev" : ""} `}
    />
  );
};

export default Joystick;
