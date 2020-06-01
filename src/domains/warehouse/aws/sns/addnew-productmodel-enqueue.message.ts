import { EnqueueMessage } from "../../../../common/aws/sns/EnqueueMessage";
import { NewProductModelMessageAttr } from "./dtos/new-productmodel-message-attributes.dto";
import { AwsMessage } from "../../../../common/aws/message.model";
import { AutoSalesWarehouseServiceAddnewProductModelStore as constants } from "./warehouse-arns-sns.constants";

export class AddnewProductModelEnQueueMessage extends EnqueueMessage {
  constructor(updateProductMessageAttrs: NewProductModelMessageAttr) {
    const params: AwsMessage = {
      Subject: constants.subject,
      MessageAttributes: updateProductMessageAttrs,
      Message: constants.message,
      TopicArn: constants.topicArn,
    };
    super(params);
  }
}
