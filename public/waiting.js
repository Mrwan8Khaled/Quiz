const socket = io();

const playersList = document.getElementById("players");
const HostStartBtn = document.getElementById("HostStartBtn");
let roomName = sessionStorage.getItem("roomName");
let id = sessionStorage.getItem("id");

socket.emit("waiting", roomName);

HostStartBtn.addEventListener("click" , () => {
    socket.emit("hostStart", roomName ,id)
})

socket.on("gameStart" , () => {
    window.location.href = "game.html"
})

socket.on('players', (rooms) => {
    playersList.innerHTML = '';
    
    rooms.forEach((room) => {
        room.players.forEach((player) => { // Assuming room.players is an array of players
            const div = document.createElement('div');
            div.className = "player";
            
            const pic = document.createElement('div');
            pic.className = "pic";
            
            const h3 = document.createElement('h3');
            h3.textContent = `${player.name}`;
            
            const firstLetter = document.createElement('span');
            firstLetter.className = "firstLetter";
            firstLetter.textContent = player.name[0];
            
            // const kickBtn = document.createElement('button');
            // kickBtn.textContent = "kick";
            // kickBtn.className = "kickOut";
            
            div.appendChild(pic);
            div.appendChild(h3);
            pic.appendChild(firstLetter);
            // div.appendChild(kickBtn);
            
            playersList.appendChild(div);
        });
    });
});
