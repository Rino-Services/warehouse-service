import { EnqueueMessage } from "../../../../common/aws/sns/EnqueueMessage";
import { AwsMessage } from "../../../../common/aws/message.model";
import { AutoSalesWarehouseServiceUpdateProductStore as constants } from "./warehouse-arns-sns.constants";
import { UpdateProductInventoryMessageAttrs } from "./dtos/updateproduct-message-attributes.dto";

export class UpdateProductEnQueueMessage extends EnqueueMessage {
  constructor(updateProductMessageAttrs: UpdateProductInventoryMessageAttrs) {
    const params: AwsMessage = {
      Subject: constants.subject,
      MessageAttributes: updateProductMessageAttrs,
      Message: constants.message,
      TopicArn: constants.topicArn,
    };
    super(params);
  }
}
