import { ModelServiceAbstract } from "../interfaces/model-service.interface";
import { Repository, Sequelize } from "sequelize-typescript";
import { QueryTypes } from "sequelize";
import { ProductInstance } from "../../../models/warehouse/product-instance.model";
import { DatabaseConnection } from "../../../database.connection";
import { WarehouseStatus } from "../../../models/warehouse/warehouse-status.model";
import { ItemStatuses } from "../../../models/warehouse/item-status.model";
import { logger } from "../../../common/logger";
import { Product } from "../../../models/warehouse/product.model";
import { ProductModel } from "../../../models/warehouse/product-model.model";

export class ProductInstanceService implements ModelServiceAbstract {
  private readonly productInstanceRepository: Repository<ProductInstance>;
  private readonly itemStatusesRepository: Repository<ItemStatuses>;
  private readonly warehouseStatusesRepository: Repository<WarehouseStatus>;
  private readonly productRepository: Repository<Product>;
  private readonly productModelRepository: Repository<ProductModel>;

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
    this.productModelRepository = this.sequelize.getRepository(ProductModel);
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
    serialNumbers: Array<string>,
    productModelId: string,
    statusCode: string
  ): Promise<number> {
    let result: number = 0;
    try {
      const items: Array<ProductInstance> = await this.productInstanceRepository.findAll(
        {
          where: {
            serialNumber: serialNumbers,
            productModelId,
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
    status: string
  ): Promise<boolean> {
    let resultTran: boolean = false;

    try {
      

      const product: Product = await this.productRepository.findOne({
        where: { id: productId },
        include: [this.productModelRepository],
      });

      logger.debug(
        `${this.logMessage} publishProductChanges -> ${JSON.stringify(product)}`
      );

      if (product) {
        // update status
        product.models.forEach(async (model) => {
          const items: ProductInstance[] = await this.find({
            where: {
              productModelId: model.id,
            },
          });

          const result = await this.setStatus(
            items.map((t) => t.serialNumber),
            model.id,
            status
          );
        });

        // call event

       
      }
    } catch (err) {
      logger.error(`${this.logMessage} publishProductChanges -> ${err}`);
    } finally {
      return resultTran;
    }
  }
}
