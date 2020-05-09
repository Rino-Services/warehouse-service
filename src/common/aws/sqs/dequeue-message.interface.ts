import { AwsMessage } from "../message.model";

export interface IDequeueMessage {
  readMessage(message: any): void;
  start(): Promise<any>;
  stop(): Promise<any>;
  processMessage(message: AwsMessage): Promise<any>;
}
