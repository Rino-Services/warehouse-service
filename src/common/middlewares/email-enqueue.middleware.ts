import { EmailBuilder } from "../email/email.builder";
import { EmailTypes } from "../models/email-types.enums";
import { Inject } from "typescript-ioc";
import { logger } from "../logger";
import { Sns } from "../aws/sns";
import { AwsConfig } from "../aws/aws-config";

export class EmailEnqueue {
  @Inject private builder: EmailBuilder;
  @Inject private sns: Sns;
  /**
   * send
   */
  public async process(model: any, type: EmailTypes): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const html = await this.builder.build(model, type);
      if (!html) {
        reject();
      } else {
        let params = {
          Subject: "Email Activation/Confirmation",
          MessageAttributes: {
            Receipt: {
              DataType: "String",
              StringValue: model.receipt,
            },
            Subject: {
              DataType: "String",
              StringValue: model.subject,
            },
            From: {
              DataType: "String",
              StringValue: model.from,
            },
          },
          Message: html,
          TopicArn: "AwsConfig.snsArnEmailActivationDeliveryTopic",
        };
        this.sns
          .publish(params)
          .then((data) => {
            logger.info(
              `Message ${params.Message} send sent to the topic ${params.TopicArn}`
            );
            logger.info("MessageID is " + data.MessageId);
            resolve();
          })
          .catch((err) => {
            logger.error(err);
            reject();
          });
      }
    });
  }
}
