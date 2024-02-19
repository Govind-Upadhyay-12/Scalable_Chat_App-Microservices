import { kafka } from "../apache-kafka/client.js";
import prisma from "../DB/db.config.js";

export const runConsumer = async () => {
  const consumer = kafka.consumer({ groupId: "group-1" });

  await consumer.connect();

  await consumer.subscribe({
    topics: ["message-update"],
    fromBeginning: true,
  });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log(
        `
           [${topic}]: PART:${partition}:`,
        message.value.toString()
      );
      const msg = message.value.toString();
      InsertIntoDb();
      async function InsertIntoDb() {
        const incoming_data = await prisma.chat.create({
          data: {
            message: msg,
          },
        });
      }
      console.log("hogya saved tera database me bhai");
    },
  });
};

runConsumer().catch((error) => {
  console.error("Error in Kafka consumer:", error);
});
