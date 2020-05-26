import { ModelServiceAbstract } from "../interfaces/model-service.interface";
import { ProductModel } from "../../../models/warehouse/product-model.model";
import { Repository } from "sequelize-typescript";
import { DatabaseConnection } from "../../../database.connection";
import { logger } from "../../../common/logger";
import { ProductModelDto } from "../../../models/warehouse/dtos/product-model.dto";
import { UuIdGenerator } from "../helpers/uuid-generator.helper";
import { Inject } from "typescript-ioc";
import { PriceHistoryService } from "./price-history.service";
import { PriceHistoryDto } from "../../../models/warehouse/dtos/price-history.dto";

export class ProductModelService implements ModelServiceAbstract {
  @Inject priceHistoryService: PriceHistoryService;
  private productModelRepository: Repository<ProductModel>;
  private db: DatabaseConnection;

  private readonly logScopeMessage: string = "ProductModelService :: ";

  constructor() {
    this.db = new DatabaseConnection();
    const sequelize = this.db.database;
    this.productModelRepository = sequelize.getRepository(ProductModel);
  }

  public async addNew(model: {
    dto: ProductModelDto;
    productId: string;
  }): Promise<any> {
    const logMessage: string = `${this.logScopeMessage} addNew ->`;

    try {
      const result: ProductModel = await this.productModelRepository.create({
        id: UuIdGenerator.generate(),
        costPrice: model.dto.costPrice,
        description: model.dto.description,
        productId: model.productId,
      });

      logger.debug(`${logMessage} ${JSON.stringify(result)}`);

      // add unit price -> to priceHistory
      if (result) {
        const priceHistoryDto: PriceHistoryDto = {
          price: 0,
          percentageApplied: model.dto.percentageApplied,
          oldPrice: model.dto.costPrice,
          productModelId: result.id,
          isCurrent: true,
        };
        const priceHistoryResult = await this.priceHistoryService.addNew(
          priceHistoryDto
        );

        if (priceHistoryResult) {
          result.priceHistory = [priceHistoryResult];
        }
        return result;
      }
    } catch (err) {
      logger.error(`${logMessage} ${JSON.stringify(err)}`);
      return null;
    }
  }
  findById<T>(id: T): Promise<any> {
    throw new Error("Method not implemented.");
  }
  public async findAll(): Promise<any> {
    const logMessage: string = `${this.logScopeMessage} findAll ->`;
    const result = await this.productModelRepository.findAll();
    logger.debug(`${logMessage} ${JSON.stringify(result)}`);
    return result;
  }
  update<T>(id: T, model: any): Promise<any> {
    throw new Error("Method not implemented.");
  }
}
