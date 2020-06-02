import { PublishEvent } from "./base-publish.event";
import { logger } from "../../../common/logger";
import { IEnqueueMessage } from "../../../common/aws/sns/EnqueueMessage";
import { Product } from "../../../models/warehouse/product.model";
import { ProductService } from "../services/product.service";
import { MessageMetaData } from "../../../common/models/metadata-message-attributes.model";
import { NewProductMessageAttrs } from "../aws/sns/dtos/newproduct-message-attributes.dto";
import { AddnewProductEnQueueMessage } from "../aws/sns/addnew-product-enqueue.message";
import { ProductModel } from "../../../models/warehouse/product-model.model";
import { NewProductModelMessageAttr } from "../aws/sns/dtos/new-productmodel-message-attributes.dto";
import { AddnewProductModelEnQueueMessage } from "../aws/sns/addnew-productmodel-enqueue.message";
import { ProductModelService } from "../services/product-model.service";

export class ProductOnlinestoreSendStockEvent implements PublishEvent {
  private productService: ProductService;
  private productModelService: ProductModelService;

  private readonly logMessage: any;
  private enqueueMessage: IEnqueueMessage;

  constructor(
    private productId: string,
    private isNewProductToStock: boolean,
    private newProductModelsToStock: Array<ProductModel>
  ) {
    this.productService = new ProductService();
    this.productModelService = new ProductModelService();
  }

  public async publish(): Promise<boolean> {
    let resultTran: boolean = false;
    const product: Product = await this.productService.findById(this.productId);

    // if product is currently published
    if (!this.isNewProductToStock) {
      return await this.publishProductModels();
    } // else not plushlied yet
    else {
      // 2. when a product is not published yet,
      // i. we nedd to send all product description
      // ii. the all product setting are:
      // ○ Product
      // |_ ProducId, ProductTitle, ProductDescription, ProductDatepublished, operation = NEW_PRODUCT
      const newProductMessageAttr: NewProductMessageAttrs = {
        ProductId: new MessageMetaData("String", product.id),
        ProductTitle: new MessageMetaData("String", product.title),
        ProductDescription: new MessageMetaData("String", product.description),
        ProductDatePublished: new MessageMetaData(
          "String",
          new Date().toDateString()
        ),
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
        let criteria: any = {
          values: {
            datePublished: new Date(),
          },
          options: {
            where: {
              id: this.productId,
            },
          },
        };

        const result = await this.productService.update(null, criteria);

        logger.debug(
          `${this.logMessage} publishProductChanges -> ${JSON.stringify(
            result
          )}`
        );

        await this.publishProductModels();

        resultTran = true;
      }
    }

    return resultTran;
  }

  private async publishProductModels(): Promise<boolean> {
    // update all productModels
    // |_ ProductModels
    // |__ description
    // |__ qty
    // |__ specs
    // |__ current price
    // |__ marketing

    try {
      this.newProductModelsToStock.forEach(async (model) => {
        const newProductModelMessageAttr: NewProductModelMessageAttr = {
          ProductModelId: new MessageMetaData("String", model.id),
          ProductId: new MessageMetaData("String", model.productId),
          ProductModelDescription: new MessageMetaData(
            "String",
            model.description
          ),
          ProductModelQtyItems: new MessageMetaData(
            "Number",
            model.items.length.toString()
          ),
          ProductModelTitleSpecs: new MessageMetaData(
            "String",
            model.specs.map((t) => t.title).join(",")
          ),
          ProductModelValueSpecs: new MessageMetaData("String", "Pending"),
          ProductModelCurrentPrice: new MessageMetaData(
            "Number",
            model.priceHistory
              .find((t) => t.isCurrent === true)
              .price.toString()
          ),
          ProductModelMarketing: new MessageMetaData("String", "Marketing"),
        };

        this.enqueueMessage = new AddnewProductModelEnQueueMessage(
          newProductModelMessageAttr
        );

        logger.debug(
          `${this.logMessage} publishProductChanges -> ${JSON.stringify(
            newProductModelMessageAttr
          )}`
        );

        if (await this.enqueueMessage.process()) {
          // update publish date of ProductModel

          let criteria: any = {
            values: {
              datePublished: new Date(),
            },
            options: {
              where: {
                id: model.id,
              },
            },
          };

          const productModelUpdateResult = await this.productModelService.update(
            null,
            criteria
          );
          logger.debug(
            `${this.logMessage} publishProductChanges -> ${JSON.stringify(
              productModelUpdateResult
            )}`
          );
        }
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}
