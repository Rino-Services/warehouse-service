import * as aws from "aws-sdk";
import { PromiseResult } from "aws-sdk/lib/request";
import { AwsConfig, AwsDefaultConfig } from "../aws-config";

export class Sns extends AwsDefaultConfig {
  constructor() {
    super();
  }

  public publish(
    params: any
  ): Promise<PromiseResult<AWS.SNS.PublishResponse, AWS.AWSError>> {
    return new aws.SNS({ apiVersion: AwsConfig.apiVersion })
      .publish(params)
      .promise();
  }
}
