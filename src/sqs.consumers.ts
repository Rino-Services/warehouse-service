import { IDequeueMessage } from "./common/aws/sqs/dequeue-message.interface";

export class SqsConsumers {
  private dequeueServices: Array<IDequeueMessage>;
  constructor() {
    this.dequeueServices = [
      // new AddNewProductDequeueMessage(),
      // new UpdateProductStoreDequeueMessage(),
    ];
  }

  public async start(): Promise<void> {
    await this.wait(3000);
    this.dequeueServices.forEach(async (item) => {
      await item.start();
    });
  }

  public async stop(): Promise<void> {
    await this.wait(3000);
    this.dequeueServices.forEach(async (item) => {
      await item.stop();
    });
  }

  private wait = (ms: number): Promise<void> =>
    new Promise((resolve) => setTimeout(resolve, ms));
}
