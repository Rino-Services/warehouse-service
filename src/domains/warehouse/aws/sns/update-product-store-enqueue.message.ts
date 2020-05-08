import { EnqueueMessage } from "../../../../common/aws/EnqueueMessage";
import { AwsMessage } from "../../../../common/aws/message.model";
import { AutoSalesWarehouseServiceUpdateProductStore as constants } from "./warehouse-arns-sns.constants";
import { UpdateProductMessageAttrs } from "./dtos/updateproduct-message-attributes.dto";

export class UpdateProductEnQueueMessage extends EnqueueMessage {
  constructor(updateProductMessageAttrs: UpdateProductMessageAttrs) {
    const params: AwsMessage = {
      Subject: constants.subject,
      MessageAttributes: updateProductMessageAttrs,
      Message: constants.message,
      TopicArn: constants.topicArn,
    };
    super(params);
  }
}
