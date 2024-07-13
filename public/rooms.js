const socket = io();

const roomList = document.getElementById("rooms");

const createRoomBtn = document.getElementById("createRoom");
const joinPrivateBtn = document.getElementById("joinPrivRoom");
const refreshBtn = document.getElementById("refresh");

createRoomBtn.addEventListener("click", () => {
  let roomName = prompt("Enter room name:");
  if (!roomName) return; // Cancelled prompt

  let type = confirm("Do you want it to be public?");
  let playersLen = prompt("Enter max number of players:");
  let numOfQ = prompt("Enter max number of questions:");

  socket.emit("createRoom", roomName, type, playersLen, numOfQ);
});

joinPrivateBtn.addEventListener("click", () => {
  let userName = prompt("Enter your name:");
  if (!userName) return; // Cancelled prompt

  let roomName = prompt("Enter room name:");
  if (!roomName) return; // Cancelled prompt

  socket.emit("joinRoom", roomName, userName);
});

// Example of adding event listener for dynamically added buttons (joinBtns)
roomList.addEventListener("click", (event) => {
  if (event.target.classList.contains("joinRoom")) {
    let userName = prompt("Enter your name:");
    if (!userName) return; // Cancelled prompt

    let roomName = event.target.parentElement.querySelector("h3").textContent;
    socket.emit("joinRoom", roomName, userName);
  }
});

socket.on("enterRoom", (roomName, id) => {
  sessionStorage.setItem("roomName", roomName);
  sessionStorage.setItem("id", id);
  window.location.href = "waiting.html"; // Redirect to waiting.html after room creation
});

refreshBtn.addEventListener("click", () => {
  // Request updated room list from the server
  socket.emit("roomListUpdate");
});

socket.on("roomListUpdate", (rooms) => {
  roomList.innerHTML = "";

  rooms.forEach((room) => {
    if (room.hide == false) {
      const li = document.createElement("li");

      const name = document.createElement("h3");
      name.textContent = room.roomName;

      const numOfp = document.createElement("h3");
      numOfp.textContent = `${room.players.length}/${room.Plength}`;

      const numOfq = document.createElement("h3");
      numOfq.textContent = `${room.numOfQ} Q`;

      const joinBtn = document.createElement("button");
      joinBtn.textContent = "Join";
      joinBtn.className = "joinRoom";

      li.appendChild(name);
      li.appendChild(numOfp);
      li.appendChild(numOfq);
      li.appendChild(joinBtn);

      roomList.appendChild(li);
    }
  });
});
