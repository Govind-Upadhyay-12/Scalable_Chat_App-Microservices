import express from "express";
import http from "http";
import { Server } from "socket.io";
import Redis from "ioredis";
import { kafka } from "../apache-kafka/client.js";
import { runConsumer } from "./consumer.js";
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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

subscriber.on("message", async (channel, message) => {
  if (channel === "message-public_another") {
    console.log("aagya from another", message);

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
  }
});

async function init() {
  const admin = kafka.admin();
  console.log("Admin connecting...");
  await admin.connect();
  console.log("Admin Connection Success...");

  console.log("Creating Topic [message-update]");
  await admin.createTopics({
    topics: [
      {
        topic: "message-update",
        numPartitions: 2,
      },
    ],
  });
  console.log("Topic Created Success [message-update]");

  console.log("Disconnecting Admin..");
  await admin.disconnect();
} 
init();

server.listen(3001, () => {
  console.log("server is started at port 3001");
});
