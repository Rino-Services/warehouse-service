import { ModelServiceAbstract } from "../interfaces/model-service.interface";
import { Repository } from "sequelize-typescript";
import { Spec } from "../../../models/warehouse/spec.model";
import { DatabaseConnection } from "../../../database.connection";
import { logger } from "../../../common/logger";
import { SpecProduct } from "../../../models/warehouse/dtos/spec-product.dto";
import { ProductSpecs } from "../../../models/warehouse/product-specs.model";
import { Inject } from "typescript-ioc";
import { ProductModelService } from "./product-model.service";

export class SpecService implements ModelServiceAbstract {
  @Inject productModelService: ProductModelService;

  private readonly specRepository: Repository<Spec>;
  private readonly db: DatabaseConnection;
  private productSpecRepository: Repository<ProductSpecs>;

  private readonly logScopeMessage: string = "SpecService :: ";

  constructor() {
    this.db = new DatabaseConnection();
    const sequelize = this.db.database;
    this.specRepository = sequelize.getRepository(Spec);
    this.productSpecRepository = sequelize.getRepository(ProductSpecs);
  }

  // Add specs will to save on PordcuctModel

  public async addSpecs(
    productModelId: string,
    specs: SpecProduct[]
  ): Promise<boolean> {
    let result = false;
    try {
      // find productModel
      const productModel = await this.productModelService.findById(
        productModelId
      );

      if (productModel) {
        specs.forEach(async (spec) => {
          const findResult: Spec = await await this.specRepository.findOne<
            Spec
          >({
            where: { title: spec.title },
          });
          if (findResult) {
            await this.productSpecRepository.create({
              value: spec.value,
              productModelId,
              specId: findResult.id,
            });
          } else {
            const specResult: Spec = await this.specRepository.create({
              title: spec.title,
            });

            if (specResult) {
              await this.productSpecRepository.create({
                value: spec.value,
                productModelId,
                specId: specResult.id,
              });
            }
          }
        });
        result = true;
      }
    } catch (err) {
      logger.error(`${err}`);
      result = false;
    } finally {
      return result;
    }
  }

  public async addNew(modelDto: any): Promise<any> {
    throw new Error("Method not implemented.");
  }
  findById<T>(id: T): Promise<any> {
    throw new Error("Method not implemented.");
  }
  public async findAll(): Promise<any> {
    const result = await this.specRepository.findAll();
    logger.debug(`${this.logScopeMessage} findAll -> ${result}`);
    return result;
  }
  update<T>(id: T, model: any): Promise<any> {
    throw new Error("Method not implemented.");
  }
}
