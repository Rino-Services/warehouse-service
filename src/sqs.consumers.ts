import { EmailReceiverSqs } from "./common/aws/sqs/email-receiver.sqs";
import { Inject } from "typescript-ioc";
export class SqsConsumers {
  @Inject private emailReceiverSqs: EmailReceiverSqs;

  public async start(): Promise<void> {
    await this.emailReceiverSqs.start();
  }

  public async stop(): Promise<void> {
    await this.emailReceiverSqs.stop();
  }
}
