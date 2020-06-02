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
import { PriceHistory } from "../../../models/warehouse/price-history.model";
import { Spec } from "../../../models/warehouse/spec.model";
import { ProductInstanceService } from "./product-instance.service";
import { ProductInstance } from "../../../models/warehouse/product-instance.model";

export class ProductModelService implements ModelServiceAbstract {
  @Inject priceHistoryService: PriceHistoryService;
  @Inject productInstanceService: ProductInstanceService;

  private db: DatabaseConnection;

  private productModelRepository: Repository<ProductModel>;
  private priceHistoryRepository: Repository<PriceHistory>;
  private specRepository: Repository<Spec>;
  private productInstanceRepository: Repository<ProductInstance>;

  private readonly logScopeMessage: string = "ProductModelService :: ";

  constructor() {
    this.db = new DatabaseConnection();
    const sequelize = this.db.database;
    this.productModelRepository = sequelize.getRepository(ProductModel);
    this.priceHistoryRepository = sequelize.getRepository(PriceHistory);
    this.specRepository = sequelize.getRepository(Spec);
    this.productInstanceRepository = sequelize.getRepository(ProductInstance);
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
          price: model.dto.costPrice,
          percentageApplied: model.dto.percentageApplied,
          oldPrice: model.dto.costPrice,
          productModelId: result.id,
          isCurrent: true,
        };
        await this.priceHistoryService.addNew(priceHistoryDto);

        return result;
      }
    } catch (err) {
      logger.error(`${logMessage} ${JSON.stringify(err)}`);
      return null;
    }
  }

  /**
   * getAllByProductId
   */
  public async getAllByProductId(productId: string) {
    const result = await this.productModelRepository.findAll({
      where: {
        productId: productId,
      },
      include: [
        this.priceHistoryRepository,
        this.specRepository,
        this.productInstanceRepository,
      ],
    });

    logger.debug(`${result}`);
    return result;
  }

  public async addNewProductsItems(
    productModelId: string,
    itemsToAdd: Array<string>
  ): Promise<boolean> {
    const logMessage: string = `${this.logScopeMessage} -> addNewProductsItems -> `;

    try {
      const product = await this.productModelRepository.findOne({
        where: { id: productModelId },
      });
      if (product) {
        // let itemsSaved: Array<ProductInstance> = [];
        itemsToAdd.forEach(async (item) => {
          // validate that serial number does not exist
          if (
            !(await this.productInstanceService.find({
              where: { serialNumber: item },
            }))
          ) {
            const itemSaved: ProductInstance = await this.productInstanceService.addNew(
              {
                productModelId,
                serialNumber: item,
              }
            );

            logger.debug(
              `${logMessage} itemSaved -> ${JSON.stringify(itemSaved)}`
            );

            if (itemSaved) {
              await this.productInstanceService.setStatus([itemSaved], "STRG");
            }
          }
        });
      }

      return true;
    } catch (err) {
      logger.error(`${logMessage} ${err}`);
      return false;
    }
  }

  public async find(id: string): Promise<ProductModel> {
    try {
      const result = await this.productModelRepository.findOne({
        where: {
          id: id,
        },
        include: [
          this.priceHistoryRepository,
          this.specRepository,
          this.productInstanceRepository,
        ],
      });
      logger.debug(
        `${this.logScopeMessage} :: findById ${JSON.stringify(result)}`
      );
      return result;
    } catch (err) {
      logger.error(`${this.logScopeMessage} findById ${JSON.stringify(err)}`);
      return new ProductModel();
    }
  }

  public async findById<T>(id: T): Promise<any> {
    throw new Error("Method not implemented.");
  }

  public async findAll(): Promise<any> {
    const logMessage: string = `${this.logScopeMessage} findAll ->`;
    const result = await this.productModelRepository.findAll();
    logger.debug(`${logMessage} ${JSON.stringify(result)}`);
    return result;
  }

  public async update<T>(
    id: T,
    criteria: {
      values: any;
      options: any;
    }
  ): Promise<any> {
    const result = await this.productModelRepository.update(
      criteria.values,
      criteria.options
    );

    return result;
  }

  public async getAllItemsFromModelsArray(
    productId: string,
    productModelIds: Array<string>
  ): Promise<Array<ProductInstance>> {
    let items: Array<ProductInstance> = [];

    const produtModelArray: Array<ProductModel> = await this.productModelRepository.findAll(
      {
        where: {
          id: productModelIds,
          productId: productId,
        },
        include: [this.productInstanceRepository],
      }
    );

    produtModelArray.forEach((model) => {
      model.items.forEach((item) => {
        items.push(item);
      });
    });

    return items;
  }
}
