export interface PublishEvent {
  publish(): Promise<boolean>;
}
