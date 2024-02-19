import express from "express";
import http from "http";
import { Server } from "socket.io";
import Redis from "ioredis";
import { kafka } from "../apache-kafka/client.js";

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

subscriber.on("message", async (channel, message) => {
  if (channel === "message-public_another" || channel === "message-publish") {
    console.log("aagya", message);
    const producer = kafka.producer();

    console.log("Connecting Producer");
    await producer.connect();
    console.log("Producer Connected Successfully");

    await producer.send({
      topic: "message-update",
      messages: [
        {
          value: message,
        },
      ],
    });

    console.log("Message sent to Kafka topic");

    await producer.disconnect();
    console.log("Producer disconnected");

    io.emit("aagya", message);
  }
});

server.listen(8080, () => {
  console.log("server is started at port 8080");
});
