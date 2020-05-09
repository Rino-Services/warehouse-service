import { AwsDefaultConfig } from "../aws-config";
import { Consumer } from "sqs-consumer";
import { IDequeueMessage } from "./dequeue-message.interface";
import { logger } from "../../logger";
import { AwsMessage } from "../message.model";

export abstract class DequeueMessage extends AwsDefaultConfig
  implements IDequeueMessage {
  private app: Consumer;
  constructor(private queueUrl: string, private dequeueServiceName: string) {
    super();
    this.app = Consumer.create({
      queueUrl: this.queueUrl,
      handleMessage: async (message) => {
        this.readMessage(message);
      },
    });
  }

  public abstract processMessage(message: AwsMessage): Promise<any>;

  public async readMessage(message: any): Promise<void> {
    logger.info(`SQS ** ${this.dequeueServiceName} -> reading now ** `);
    let body = JSON.parse(message.Body);
    logger.debug(JSON.stringify(message.Body));
    if (body) {
      await this.processMessage(body);
    }
  }
  public start(): Promise<any> {
    return new Promise((resolve) => {
      logger.info(`SQS ** ${this.dequeueServiceName} is running ** `);
      this.app.start();
      setTimeout(resolve, 1000);
    });
  }
  public stop(): Promise<any> {
    return new Promise((resolve) => {
      logger.info(`SQS ** ${this.dequeueServiceName} is stopping ** `);
      this.app.stop();
      setTimeout(resolve, 1000);
    });
  }
}
