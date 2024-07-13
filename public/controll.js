const socket = io();

const Abtn = document.getElementById("a");
const Bbtn = document.getElementById("b");
const Cbtn = document.getElementById("c");
const Dbtn = document.getElementById("d");

Abtn.addEventListener("click", () => {
    tap("a");
});
Bbtn.addEventListener("click", () => {
    tap("b");
});
Cbtn.addEventListener("click", () => {
    tap("c");
});
Dbtn.addEventListener("click", () => {
    tap("d");
});

function tap(type) {
    socket.emit("answer", type);
}