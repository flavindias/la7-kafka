import dotenv from "dotenv";
import { app } from "./express";
import { createServer } from "http";
import { KafkaConnection } from "./kafka";
dotenv.config();
const {
  PORT,
  KAFKA_BROKERS,
  CONSUMER_TOPICS,
  PRODUCER_TOPICS,
} = process.env;
const httpServer = createServer(app);
const kafka: KafkaConnection = new KafkaConnection("auth", `${KAFKA_BROKERS}`.split(","));
kafka.subscribe([...`${CONSUMER_TOPICS}`.split(","), ...`${PRODUCER_TOPICS}`.split(",")]);

httpServer.listen(PORT, async function () {
  try {
    kafka.consume();
    console.log(`server is listening on ${PORT}`);
  } catch (error) {
    console.log(error);
  }
});
