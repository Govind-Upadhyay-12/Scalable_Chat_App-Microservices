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
    await publisher.publish("message-public_another", message);
    io.emit("message", message);
  });
});

subscriber.subscribe("message-publish");

subscriber.on("message", (channel, message) => {
  if (channel === "message-publish") {
    console.log("aagya", message);
    io.emit("aagya", message);
  }
});

server.listen(8080, () => {
  console.log("server is started at port 8080");
});
