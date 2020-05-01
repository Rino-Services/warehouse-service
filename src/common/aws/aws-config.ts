import * as aws from "aws-sdk";
export class AwsConfig {
  public static readonly region: string = "us-west-2";
  public static readonly apiVersion: string = "2010-03-31";
}

export class AwsDefaultConfig {
  constructor() {
    aws.config.update({
      region: AwsConfig.region,
      accessKeyId: process.env.AWS_KEYID,
      secretAccessKey: process.env.AWS_KEYSECRET,
    });
  }
}
