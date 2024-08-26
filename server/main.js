const NPC = require("./src/Class.js");

let prueba = new NPC(64, 64, 1);

console.log("NPC", prueba);

const express = require("express");
const http = require("http");
const path = require("path");

const app = express();

const distPath = path.join(__dirname, "..", "dist");
const { Server } = require("socket.io");
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
app.use(express.static(distPath));

const currentDir = __dirname;

// Cambia al directorio superior y luego a 'cliente/dist/index'
const targetPath = path.join(currentDir, "..", "dist", "index.html");

let gamePlayers = {};
let gameEntetys = [prueba];

io.on("connection", (socket) => {
  // // Ciclo principal del juego en el servidor
  setInterval(() => {
    const deltaTime = 16.66; // Aproximadamente 60 FPS
    // updateGameState(deltaTime);
    io.emit("update", [...Object.values(gamePlayers)]);
    // Enviar estado actualizado a todos los clientes
    // prueba.update()
  }, 20 / 10);

  socket.emit("start", socket.id);
  gamePlayers[socket.id] = { socketID: socket.id };

  socket.once("find", (data) => {
    gamePlayers[data.socketID] = {
      ...gamePlayers[data.socketID],
      position: data.position,
    };
    io.emit("allplayers", [...Object.values(gamePlayers)]);
    io.emit("addEntity", gameEntetys);
  });

  socket.on("playerMove", (playerMoved) => {
    gamePlayers[socket.id] = { ...gamePlayers[socket.id], ...playerMoved };
    // io.emit("allplayersRefresh", gamePlayers[socket.id]);
    // io.emit("update", [...Object.values(gamePlayers)]);
  });

  socket.on("disconnect", () => {
    delete gamePlayers[socket.id];

    console.log("user disconnected", gamePlayers);
    io.emit("removePlayer", socket.id);
  });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});

app.get("*", (req, res) => {
  res.sendFile(path.join(targetPath));
});

app.listen(4000, () => {
  console.log("Server is running on port 3000");
});
