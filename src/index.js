import express from "express";
import http from "http";
import { Server } from "socket.io";
import Redis from "ioredis";


const app = express();
const server = http.createServer(app);
const io = new Server(server);

const publisher = new Redis({
  host: "localhost",
  port: 6379,
});

const subscriber = new Redis({
  host: "localhost",
  port: 6379,
});

io.on("connection", (socket) => {
  console.log("new user is connected", socket.id);

  socket.on("message-bejte", async (message) => {
    console.log("message aara hai", message);
    await publisher.publish("message-publish", message);
    io.emit("message", message);
  });
});
subscriber.subscribe("message-public_another");

subscriber.on("message", (channel, message) => {
  if (channel === "message-public_another") {
    console.log("aagya from another", message);
    io.emit("aagya_from_another", message);
  }
});
server.listen(3001, () => {
  console.log("server is started at port 3001");
});
