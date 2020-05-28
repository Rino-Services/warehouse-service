export interface PublishBase {
  publish(criteria: any): Promise<boolean>;
}
