import { ModelServiceAbstract } from "../interfaces/model-service.interface";
import { Repository, Sequelize } from "sequelize-typescript";
import { QueryTypes } from "sequelize";
import { ProductInstance } from "../../../models/warehouse/product-instance.model";
import { DatabaseConnection } from "../../../database.connection";
import { WarehouseStatus } from "../../../models/warehouse/warehouse-status.model";
import { ItemStatuses } from "../../../models/warehouse/item-status.model";
import { logger } from "../../../common/logger";
import { AddnewProductEnQueueMessage } from "../aws/sns/addnew-product-enqueue.message";
import { Product } from "../../../models/warehouse/product.model";
import { NewProductMessageAttrs } from "../aws/sns/dtos/newproduct-message-attributes.dto";
import { MessageMetaData } from "../../../common/models/metadata-message-attibutes.model";
import { UpdateProductMessageAttrs } from "../aws/sns/dtos/updateproduct-message-attributes.dto";
import { IEnqueueMessage } from "../../../common/aws/EnqueueMessage";
import { UpdateProductEnQueueMessage } from "../aws/sns/update-product-store-enqueue.message";

export class ProductInstanceService implements ModelServiceAbstract {
  private readonly productInstanceRepository: Repository<ProductInstance>;
  private readonly itemStatusesRepository: Repository<ItemStatuses>;
  private readonly warehouseStatusesRepository: Repository<WarehouseStatus>;
  private readonly productRepository: Repository<Product>;
  private readonly db: DatabaseConnection;
  private readonly logMessage: string = "ProductInstanceService :: ";
  private readonly sequelize: Sequelize;

  constructor() {
    this.db = new DatabaseConnection();
    this.sequelize = this.db.database;
    this.productInstanceRepository = this.sequelize.getRepository(
      ProductInstance
    );
    this.itemStatusesRepository = this.sequelize.getRepository(ItemStatuses);
    this.warehouseStatusesRepository = this.sequelize.getRepository(
      WarehouseStatus
    );
    this.productRepository = this.sequelize.getRepository(Product);
  }
  addNew(modelDto: any): Promise<any> {
    throw new Error("Method not implemented.");
  }
  findById<T>(id: T): Promise<any> {
    throw new Error("Method not implemented.");
  }
  findAll(): Promise<any> {
    throw new Error("Method not implemented.");
  }
  update<T>(id: T, model: any): Promise<any> {
    throw new Error("Method not implemented.");
  }

  public async setStatus(
    serialNumbers: Array<string>,
    productId: string,
    statusCode: string
  ): Promise<number> {
    let result: number = 0;
    try {
      const items: Array<ProductInstance> = await this.productInstanceRepository.findAll(
        {
          where: {
            serialNumber: serialNumbers,
            productId,
          },
        }
      );

      logger.debug(`${this.logMessage} setStatus -> ${items}`);

      const status: WarehouseStatus = await this.warehouseStatusesRepository.findOne(
        {
          where: {
            initials: statusCode,
          },
        }
      );

      logger.debug(`${this.logMessage} setStatus -> ${status}`);
      items.forEach(async (item) => {
        result += 1;
        await this.itemStatusesRepository.create({
          warehouseStatusId: status.id,
          productInstanceId: item.id,
        });
      });

      logger.info(`${this.logMessage} setStatus -> ${result} result added`);
      await this.publishProductChanges(productId, statusCode, result);
    } catch (err) {
      logger.error(`${this.logMessage} setStatus -> ${err}`);

      result = -1;
    } finally {
      return result;
    }
  }

  public async getStatusByProduct(productId: string): Promise<Array<any>> {
    //

    const result: Array<any> = await this.productInstanceRepository.sequelize.query(
      `
          SELECT 
          COUNT(PI."id") as "qty",
            WS."initials" as "status"
          FROM 
            "ProductInstances" PI INNER JOIN "ItemStatuses" ITS ON PI."id" = ITS."productInstanceId"
            INNER JOIN "WarehouseStatuses" WS ON WS."id" = ITS."warehouseStatusId"
          WHERE (PI."deletionDate" IS NULL AND PI."productId" = '06c9eab0-8fff-11ea-9df0-3de0bd1831bb')
          GROUP BY 
            WS."initials";
        `,
      {
        type: QueryTypes.SELECT,
      }
    );

    logger.debug(
      `${this.logMessage} getStatusByProduct -> ${JSON.stringify(result)}`
    );
    return result;
  }

  private async publishProductChanges(
    productId: string,
    status: string,
    qty: number
  ): Promise<void> {
    let enqueueMessage: IEnqueueMessage;

    const product: Product = await this.productRepository.findOne({
      where: { id: productId },
    });

    if (product)
      switch (status) {
        case "STCK":
          if (!product.datePublished) {
            const updateProductMessageAttr: UpdateProductMessageAttrs = {
              ProductId: new MessageMetaData("String", product.id),
              Operation: new MessageMetaData("String", status),
              ProductStock: new MessageMetaData("Number", qty.toString()),
            };

            enqueueMessage = new UpdateProductEnQueueMessage(
              updateProductMessageAttr
            );
            if (await enqueueMessage.process()) {
              await this.productRepository.update(
                {
                  datePublished: new Date(),
                },
                {
                  where: {
                    id: productId,
                  },
                }
              );
            }
          } else {
            const newProductMessageAttr: NewProductMessageAttrs = {
              ProductId: new MessageMetaData("String", product.id),
              ProductTitle: new MessageMetaData("String", product.title),
              ProductModel: new MessageMetaData("String", product.model),
              ProductDescription: new MessageMetaData(
                "String",
                product.description
              ),
              ProductDatePublished: new MessageMetaData(
                "String",
                product.datePublished.toDateString()
              ),
              ProductStock: new MessageMetaData("Number", qty.toString()),
            };

            enqueueMessage = new AddnewProductEnQueueMessage(
              newProductMessageAttr
            );

            if (await enqueueMessage.process()) {
              await this.productRepository.update(
                {
                  datePublished: new Date(),
                },
                {
                  where: {
                    id: productId,
                  },
                }
              );
            }
          }

          break;
        case "SOLD":
          const updateProductMessageAttr: UpdateProductMessageAttrs = {
            ProductId: new MessageMetaData("String", product.id),
            Operation: new MessageMetaData("String", status),
            ProductStock: new MessageMetaData("Number", qty.toString()),
          };

          enqueueMessage = new UpdateProductEnQueueMessage(
            updateProductMessageAttr
          );
          if (await enqueueMessage.process()) {
            await this.productRepository.update(
              {
                datePublished: new Date(),
              },
              {
                where: {
                  id: productId,
                },
              }
            );
          }

          break;
        default:
          break;
      }
  }
}
