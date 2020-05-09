import { Sns } from "./sns";
import { AwsMessage } from "../message.model";
import { Inject } from "typescript-ioc";
import { logger } from "../../logger";

export interface IEnqueueMessage {
  process(): Promise<boolean>;
}

export class EnqueueMessage implements IEnqueueMessage {
  @Inject private sns: Sns;
  constructor(private params: AwsMessage) {
    logger.debug(`EnqueueMessage -> constructor -> ${JSON.stringify(params)}`);
  }

  public async process(): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      this.sns
        .publish(this.params)
        .then((data) => {
          logger.info(
            `Message ${this.params.Message} send sent to the topic ${this.params.TopicArn}`
          );
          logger.info("MessageID is " + data.MessageId);
          resolve(true);
        })
        .catch((err) => {
          logger.error(err);
          reject(false);
        });
    });
  }
}
