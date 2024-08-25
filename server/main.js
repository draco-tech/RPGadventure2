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

let allPlayers = [];
io.on("connection", (socket) => {
  socket.emit("start", socket.id);

  socket.once("find", (data) => {
    allPlayers.push(data);

    console.log("data", data);

    io.emit("allplayers", allPlayers);
  });
  socket.on("playerMove", (playerMoved) => {
    const actualizePlayer = allPlayers.filter(
      (players) => players.socketID !== playerMoved.socketID
    );

    allPlayers = [...actualizePlayer, playerMoved];
    io.emit("allplayersRefresh", playerMoved);
  });

  // socket.on("whiteMoved", (data) => {

  //   io.emit("whiteActualize", data);
  // });

  socket.on("disconnect", () => {
    console.log("user disconnected", allPlayers);

    const restPlayer = allPlayers.filter((p) => p.socketID !== socket.id);

    allPlayers = restPlayer;

    console.log("allPlayers", allPlayers);
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
