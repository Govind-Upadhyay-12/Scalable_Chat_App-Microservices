const io = require("socket.io-client");

const socket = io("http://localhost:3001");

socket.on("connect", () => {
  console.log("Connected to server");
});  
socket.on("message", (message) => {
  console.log("message aaya h bhai log", message);
});
socket.on("disconnect", () => {
  console.log("Disconnected from server");
}); 
const msg = "hey how are you govind";
function sendMsg() {
  socket.emit("message-bejte", msg);
}
sendMsg();
 