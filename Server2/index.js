import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

io.on("connection", (socket) => {
  console.log("new user is connected", socket.id);

  socket.on("message-bejte", (message) => {
    console.log("message aara hai", message);
    io.emit("message", message);
  });
}); 

server.listen(8080, () => {
  console.log("server is started at port 8080");
});
