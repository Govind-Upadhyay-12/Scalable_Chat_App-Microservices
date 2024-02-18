import { kafka } from "../apache-kafka/client.js"

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
          ` [${topic}]: PART:${partition}:`,
          message.value.toString()
        );
      },
    });
  };
  
  runConsumer().catch((error) => {
    console.error("Error in Kafka consumer:", error);
  });
