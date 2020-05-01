import * as aws from "aws-sdk";
import { logger } from "../logger";
import { AwsDefaultConfig } from "./aws-config";

export class Ses extends AwsDefaultConfig {
  private ses: aws.SES;
  constructor() {
    super();
    this.ses = new aws.SES({ apiVersion: "latest" });
  }

  public sendEmail(options: aws.SES.SendEmailRequest): Promise<any> {
    return new Promise((resolve, reject) => {
      this.ses.sendEmail(options, (err: any, result: any) => {
        if (err) {
          logger.error(err);
          reject(err);
        } else {
          logger.info(result);
          resolve(result);
        }
      });
    });
  }
}
