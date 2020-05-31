import { PublishEvent } from "./base-publish.event";
import { logger } from "../../../common/logger";
import { IEnqueueMessage } from "../../../common/aws/sns/EnqueueMessage";
import { Product } from "../../../models/warehouse/product.model";
import { Inject } from "typescript-ioc";
import { ProductService } from "../services/product.service";
import { UpdateProductEnQueueMessage } from "../aws/sns/update-product-store-enqueue.message";
import { UpdateProductMessageAttrs } from "../aws/sns/dtos/updateproduct-message-attributes.dto";
import { MessageMetaData } from "../../../common/models/metadata-message-attributes.model";
import { NewProductMessageAttrs } from "../aws/sns/dtos/newproduct-message-attributes.dto";
import { AddnewProductEnQueueMessage } from "../aws/sns/addnew-product-enqueue.message";
import { ProductModel } from "../../../models/warehouse/product-model.model";

export class ProductOnlinestoreSendStockEvent implements PublishEvent {
  @Inject productService: ProductService;

  private readonly logMessage: any;
  private enqueueMessage: IEnqueueMessage;

  constructor(
    private productId: string,
    private isNewProductToStock: boolean,
    private newProductModelsToStock: Array<ProductModel>
  ) {}

  public async publish(): Promise<boolean> {
    let resultTran: boolean = false;
    const product: Product = await this.productService.findById(this.productId);

    // if product is currently published
    if (!this.isNewProductToStock) {
      // 1. when we have a new productModel(s)
      // i. we need to send all, productModel description,
      // ii. the all productModel details
      // ○ ProductModel
      // |__ productId, operation = NEW_PRODUCT_MODEL
      // |__ description
      // |__ qty
      // |__ specs
      // |__ current price
      // |__ marketing

      // check if product models are published

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
        await this.productService.update(
          {
            datePublished: new Date(),
          },
          {
            where: {
              id: criteria.productId,
            },
          }
        );
        resultTran = true;
      }
    } // else not plushlied yet
    else {
      // 2. when a product is not published yet,
      // i. we nedd to send all product description
      // ii. the all product setting are:
      // ○ Product
      // |_ ProducId, ProductTitle, ProductDescription, ProductDatepublished, operation = NEW_PRODUCT
      // |_ ProductModels
      // |__ description
      // |__ qty
      // |__ specs
      // |__ current price
      // |__ marketing
      const newProductMessageAttr: NewProductMessageAttrs = {
        ProductId: new MessageMetaData("String", product.id),
        ProductTitle: new MessageMetaData("String", product.title),
        ProductDescription: new MessageMetaData("String", product.description),
        ProductDatePublished: new MessageMetaData(
          "String",
          new Date().toDateString()
        ),
        ProductStock: new MessageMetaData("Number", qty.toString()),
      };

      logger.debug(
        `${this.logMessage} publishProductChanges -> ${JSON.stringify(
          newProductMessageAttr
        )}`
      );

      this.enqueueMessage = new AddnewProductEnQueueMessage(
        newProductMessageAttr
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
          `${this.logMessage} publishProductChanges -> ${JSON.stringify(
            result
          )}`
        );

        resultTran = true;
      }
    }

    return resultTran;
  }
}
