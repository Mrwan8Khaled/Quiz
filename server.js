const socketIo = require("socket.io");
const express = require("express");
const http = require("http");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Array to store rooms
let rooms = [];

app.use(express.static("public"));

app.get("/rooms", (req, res) => {
  res.send(rooms);
});

io.on("connection", (socket) => {
  console.log("A user connected");
  socket.emit("roomListUpdate", rooms);

  socket.on("createRoom", (roomName, type, playersLen, numOfQ) => {
    let findRoom = rooms.find((r) => r.roomName === roomName);
    if (!findRoom) {
      let createdRoom = {
        roomName: roomName,
        players: [],
        Plength: parseInt(playersLen),
        numOfQ: parseInt(numOfQ),
        type: type,
        hide: false,
        host: socket.id,
      };

      rooms.push(createdRoom);
      socket.join(roomName);
      socket.room = roomName;

      console.log(`Room ${roomName} created and joined`);
      updateRoomList();
      socket.emit("enterRoom", roomName, socket.id);
    } else {
      socket.emit("roomError", "Room already exists");
    }
  });

  socket.on("joinRoom", (roomName, username) => {
    const room = rooms.find((r) => r.roomName === roomName);

    if (room && room.players.length < room.Plength) {
      socket.join(roomName);
      socket.room = roomName;
      socket.username = username;
      room.players.push({
        id: socket.id,
        name: username,
      });

      console.log(`${username} joined ${roomName}`);
      updateRoomList();
      socket.to(roomName).emit("players", rooms);
      socket.emit("enterRoom", roomName ,socket.id);
      if (room.players.length >= room.Plength) {
        startGame(roomName, room);
      }
    } else {
      socket.emit("roomError", "Room is full or does not exist.");
    }
  });

  socket.on("waiting", (roomName) => {
    const room = rooms.find((r) => r.roomName === roomName);
    if (room) {
      socket.emit("players", rooms);
    } else {
      socket.emit("roomError", "Room is full or does not exist.");
    }
  });

  socket.on("hostStart", (roomName , id) => {
    const room = rooms.find((r) => r.roomName === roomName);
    console.log(room.host);
    console.log(id);
    if (room && id == room.host) {
      console.log("room Started");
      startGame(roomName, room);
    }
  });

  function updateRoomList() {
    io.emit("roomListUpdate", rooms);
  }

  function startGame(roomName, room) {
    io.to(roomName).emit("gameStart", roomName, room.players);
    room.hide = true;
  }

  socket.on("answer", (type) => {
    console.log(type);
    io.emit("answer", type);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
