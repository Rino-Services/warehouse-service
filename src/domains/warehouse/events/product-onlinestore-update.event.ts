import { PublishBase } from "./base-publish.event";
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

export class ProductOnlinestorePublishEvent implements PublishBase {
  @Inject productService: ProductService;

  private readonly logMessage: any;
  private enqueueMessage: IEnqueueMessage;

  public async publish(criteria: {
    productId: string;
    status: string;
  }): Promise<boolean> {
    let resultTran: boolean = false;
    const product: Product = await this.productService.findById(
      criteria.productId
    );

    switch (status) {
      case "STCK":
        // if product is currently published
        if (product.datePublished) {
          // recursive pusblishing,
          // find new ProductModel not published yet
          //
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
          const newProductMessageAttr: NewProductMessageAttrs = {
            ProductId: new MessageMetaData("String", product.id),
            ProductTitle: new MessageMetaData("String", product.title),
            ProductDescription: new MessageMetaData(
              "String",
              product.description
            ),
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

        break;
      case "SOLD":
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
            `${this.logMessage} publishProductChanges -> ${JSON.stringify(
              result
            )}`
          );
          resultTran = true;
        }

        break;
      default:
        logger.debug(
          `${this.logMessage} publishProductChanges -> Debug status > ${status}`
        );
        break;
    }

    return resultTran;
  }
}
