import { Kafka, Consumer, Producer } from "kafkajs";

export class KafkaConnection {
  private kafka: Kafka;
  private consumer: Consumer;
  private producer: Producer;

  constructor(appName: string, brokers: string[]) {
    this.kafka = new Kafka({
      clientId: appName,
      brokers,
    });
    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({ groupId: `${appName}-group` });
  }

  async subscribe(topics: string[]) {
    try {
      topics.map(async topic => {
          await this.consumer.stop();
          await this.consumer.subscribe({ topic, fromBeginning: false });
      });
      const resumeList = topics.map(topic => { return { topic }; });
      await this.consumer.resume(resumeList);
    } catch (error) {
      console.error(error);
    }
  }

  async produce(topic: string, data: string) {
    try {
      await this.producer.connect();
      const resp = await this.producer.send({
        topic,
        timeout: 2,
        messages: [
          {
            key: `key-${Math.random().toString(36).substring(7)}`,
            value: data,
          },
        ],
      });
      if (resp) {
        console.log(resp, "data has been sent");
        return { resp, topic, data };
      }
    } catch (error) {
      console.error(error);
    }
  }

  async consume() {
    try {
      await this.consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          console.log({
            topic,
            partition,
            value: message.value?.toString(),
          });
        },
      });
    } catch (error) {
      console.error(error);
    }
  }
}
