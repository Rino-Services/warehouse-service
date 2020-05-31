import { PublishEvent } from "./base-publish.event";
import { logger } from "../../../common/logger";
import { UpdateProductMessageAttrs } from "../aws/sns/dtos/updateproduct-message-attributes.dto";
import { MessageMetaData } from "../../../common/models/metadata-message-attributes.model";
import { UpdateProductEnQueueMessage } from "../aws/sns/update-product-store-enqueue.message";
import { IEnqueueMessage } from "../../../common/aws/sns/EnqueueMessage";

export class ProductOnlineStoreUpdateEvent implements PublishEvent {
  private readonly logMessage: string = "ProductOnlineStoreSoldEvent :: ";
  private enqueueMessage: IEnqueueMessage;

  // Before to send an object, we need to check all scenarios

  // 3. when we have a new productModel inventory
  // i. we need to send limited product details
  // ii. productDetails
  // ○ Details
  // |__ operation = UPDATE_INVENTORY
  // |__ qty (to add, would be to (+) add o (-)substract, )
  // |__ productId
  // |__ productModelId
  constructor(private newItemsInventoryToStock: Map<string, number>) {}

  /**
   * 
   * @param criteria 
   * //Iterate over map entries
      for (let entry of nameAgeMapping.entries()) {
          console.log(entry[0], entry[1]);    //"Lokesh" 37 "Raj" 35 "John" 40
      }
   */

  public async publish(): Promise<boolean> {
    let resultTran: boolean = false;

    const updateProductMessageAttr: UpdateProductMessageAttrs = {
      ProductId: new MessageMetaData("String", product.id),
      Operation: new MessageMetaData("String", status),
      ProductStock: new MessageMetaData("Number", qty.toString()),
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
      const result = await this.productService.update(
        {
          datePublished: new Date(),
        },
        {
          where: {
            id: criteria.productId,
          },
        }
      );

      logger.debug(
        `${this.logMessage} publishProductChanges -> ${JSON.stringify(result)}`
      );
      resultTran = true;
    }
  }
}
