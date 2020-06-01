import { PublishEvent } from "./base-publish.event";
import { logger } from "../../../common/logger";
import { UpdateProductInventoryMessageAttrs } from "../aws/sns/dtos/updateproduct-message-attributes.dto";
import { MessageMetaData } from "../../../common/models/metadata-message-attributes.model";
import { UpdateProductEnQueueMessage } from "../aws/sns/update-product-store-enqueue.message";
import { IEnqueueMessage } from "../../../common/aws/sns/EnqueueMessage";

export class ProductOnlineStoreUpdateEvent implements PublishEvent {
  private readonly logMessage: string = "ProductOnlineStoreSoldEvent :: ";
  private enqueueMessage: IEnqueueMessage;

  constructor(
    private newItemsInventoryToStock: Map<string, number>,
    private status: string
  ) {}
  public async publish(): Promise<boolean> {
    let resultTran: boolean = false;

    try {
      for (let entry of this.newItemsInventoryToStock.entries()) {
        const updateProductMessageAttr: UpdateProductInventoryMessageAttrs = {
          ProductModelId: new MessageMetaData("String", entry[0]),
          Operation: new MessageMetaData("String", this.status),
          Qty: new MessageMetaData("Number", entry[1].toString()),
        };
        logger.debug(
          `${this.logMessage} publishProductChanges -> ${JSON.stringify(
            updateProductMessageAttr
          )}`
        );
        this.enqueueMessage = new UpdateProductEnQueueMessage(
          updateProductMessageAttr
        );
        if (await this.enqueueMessage.process()) {
          logger.info(``);
        }

        resultTran = true;
      }
    } catch (error) {
      resultTran = false;
      logger.error(`${this.logMessage} publish -> ${error}`);
    } finally {
      return resultTran;
    }
  }
}
