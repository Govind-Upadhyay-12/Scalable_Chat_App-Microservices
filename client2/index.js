const io = require("socket.io-client");

const socket = io("http://localhost:8080");
 
socket.on("connect", () => {   
  console.log("Connected to server"); 
});  

socket.on("message", (message) => {
  console.log("message aaya h bhai log", message);
});
socket.on("disconnect", () => {  
  console.log("Disconnected from server");
});
socket.on("aagy");
const msg = "hey i am from another server ";
function sendMsg() {
  socket.emit("message-bejte", msg);
}
sendMsg();
