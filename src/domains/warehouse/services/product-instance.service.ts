import { ModelServiceAbstract } from "../interfaces/model-service.interface";
import { Repository, Sequelize } from "sequelize-typescript";
import { QueryTypes } from "sequelize";
import { ProductInstance } from "../../../models/warehouse/product-instance.model";
import { DatabaseConnection } from "../../../database.connection";
import { WarehouseStatus } from "../../../models/warehouse/warehouse-status.model";
import { ItemStatuses } from "../../../models/warehouse/item-status.model";
import { logger } from "../../../common/logger";
import { Inject } from "typescript-ioc";
import { ProductService } from "./product.service";
import { ProductModelService } from "./product-model.service";
import { ProductModel } from "../../../models/warehouse/product-model.model";
import { PublishEvent } from "../events/base-publish.event";
import { Product } from "../../../models/warehouse/product.model";
import { ProductOnlinestoreSendStockEvent } from "../events/product-onlinestore-sentstock.event";
import { ProductOnlineStoreUpdateEvent } from "../events/product-onlinestore-update.event";

export class ProductInstanceService implements ModelServiceAbstract {
  @Inject productService: ProductService;
  @Inject productModelService: ProductModelService;
  @Inject publishEvents: Array<PublishEvent>;

  private readonly productInstanceRepository: Repository<ProductInstance>;
  private readonly itemStatusesRepository: Repository<ItemStatuses>;
  private readonly warehouseStatusesRepository: Repository<WarehouseStatus>;

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
  }
  public async addNew(modelDto: {
    productModelId: string;
    serialNumber: string;
  }): Promise<any> {
    const result = await this.productInstanceRepository.create({
      productModelId: modelDto.productModelId,
      serialNumber: modelDto.serialNumber,
    });
    return result;
  }

  public async find(criteria: any) {
    return this.productInstanceRepository.findOne(criteria);
  }

  public async findById<T>(id: T): Promise<any> {
    throw new Error("Method not implemented.");
  }
  findAll(): Promise<any> {
    throw new Error("Method not implemented.");
  }
  update<T>(id: T, model: any): Promise<any> {
    throw new Error("Method not implemented.");
  }

  public async setStatus(
    productModelIds: Array<string>,
    statusCode: string
  ): Promise<number> {
    // set result transacion to 0 as err message
    let result: number = 0;
    try {
      const status: WarehouseStatus = await this.warehouseStatusesRepository.findOne(
        {
          where: {
            initials: statusCode,
          },
        }
      );

      logger.debug(`${this.logMessage} setStatus -> ${status}`);

      productModelIds.forEach(async (model) => {
        logger.debug(`${this.logMessage} setStatus -> ${model}`);

        const productModel: ProductModel = await this.productModelService.findById(
          model
        );

        productModel.items.forEach(async (item) => {
          // find all items as same status, and exept that
          const productInstance: ProductInstance = await this.find({
            where: {
              id: item.id,
            },
            includes: [this.itemStatusesRepository],
          });

          if (
            !productInstance.itemStatus
              .map((t) => t.initials)
              .includes(statusCode)
          ) {
            result += 1;
            await this.itemStatusesRepository.create({
              warehouseStatusId: status.id,
              productInstanceId: item.id,
            });
          }
        });
      });

      logger.info(`${this.logMessage} setStatus -> ${result} result added`);
      // await this.publishProductChanges(productModelId, statusCode, result);
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
          WHERE (PI."deletionDate" IS NULL AND PI."productId" = '${productId}')
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

  //

  public async publishProductChanges(
    productId: string,
    produtModelIds: Array<string>,
    status: string
  ): Promise<boolean> {
    let resultTran: boolean = false;
    let isNewProductToStock: boolean = false;
    let newProductModelsToStock: Array<ProductModel>;
    let newItemsInventoryToStock: Map<string, number>;

    try {
      // update status

      const product: Product = await this.productService.findById(productId);
      if (!product.datePublished) isNewProductToStock = true;

      produtModelIds.forEach(async (model) => {
        // find productModelId
        const productModel: ProductModel = await this.productModelService.findById(
          model
        );

        if (!productModel.datePublished) {
          newProductModelsToStock.push(productModel);

          const result = await this.setStatus([model], status);

          logger.info(
            `${this.logMessage} publishProductChanges -> ${result} Items added, productModel: ${model}`
          );
        } else {
          const itemsAffected: number = await this.setStatus([model], status);
          newItemsInventoryToStock.set(model, itemsAffected);

          logger.info(
            `${this.logMessage} publishProductChanges -> ${JSON.stringify(
              newItemsInventoryToStock
            )} Items added, productModel: ${model}`
          );
        }
      });
      resultTran = true;
    } catch (err) {
      logger.error(`${this.logMessage} publishProductChanges -> ${err}`);
    } finally {
      if (resultTran) {
        // call events
        this.publishEvents = [
          new ProductOnlinestoreSendStockEvent(
            productId,
            isNewProductToStock,
            newProductModelsToStock
          ),
          new ProductOnlineStoreUpdateEvent(newItemsInventoryToStock, status),
        ];

        this.publishEvents.forEach(async (element) => {
          await element.publish();
        });
      }

      return resultTran;
    }
  }
}
