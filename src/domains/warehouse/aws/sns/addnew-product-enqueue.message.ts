import { EnqueueMessage } from "../../../../common/aws/sns/EnqueueMessage";
import { AwsMessage } from "../../../../common/aws/message.model";
import { NewProductMessageAttrs } from "./dtos/newproduct-message-attributes.dto";
import { AutoSalesWarehouseServiceAddnewProductStore as constants } from "./warehouse-arns-sns.constants";

export class AddnewProductEnQueueMessage extends EnqueueMessage {
  constructor(productMessageAttrs: NewProductMessageAttrs) {
    const params: AwsMessage = {
      Subject: constants.subject,
      MessageAttributes: productMessageAttrs,
      Message: constants.message,
      TopicArn: constants.topicArn,
    };
    super(params);
  }
}
