import { Repository } from "sequelize-typescript";
import { ModelServiceAbstract } from "../interfaces/model-service.interface";
import { Product } from "../../../models/warehouse/product.model";
import { ProductDto } from "../../../models/warehouse/dtos/product.dto";
import { DatabaseConnection } from "../../../database.connection";
import { UuIdGenerator } from "../helpers/uuid-generator.helper";
import { Spec } from "../../../models/warehouse/spec.model";
import { ProductSpecs } from "../../../models/warehouse/product-specs.model";
import { logger } from "../../../common/logger";
import { SpecProduct } from "../../../models/warehouse/dtos/spec-product.dto";

export class ProductService implements ModelServiceAbstract {
  private productRepository: Repository<Product>;
  private specRepository: Repository<Spec>;
  private productSpecRepository: Repository<ProductSpecs>;
  private db: DatabaseConnection;

  private readonly logScopeMessage: string = "ProductService :: ";

  constructor() {
    this.db = new DatabaseConnection();
    const sequelize = this.db.database;
    this.productRepository = sequelize.getRepository(Product);
    this.specRepository = sequelize.getRepository(Spec);
    this.productSpecRepository = sequelize.getRepository(ProductSpecs);
  }

  public async findAll(): Promise<any> {
    const result = await this.productRepository.findAll({
      include: [this.specRepository],
    });
    return result;
  }

  public async addNew(product: ProductDto): Promise<any> {
    const logMessage: string = `${this.logScopeMessage} addNew ->`;
    try {
      let result = await this.productRepository.create({
        id: UuIdGenerator.generate(),
        title: product.title,
        model: product.model,
        description: product.description,
        brandId: product.brandId,
        supplierId: product.supplierId,
      });

      logger.debug(` ${logMessage} ${JSON.stringify(result)}`);

      // add specs
      this.addSpecs(result.id, product.specs);

      return result;
    } catch (err) {
      logger.error(`${logMessage} -> ${err}`);
    }
  }
  private addSpecs(productId: string, specs: SpecProduct[]): void {
    specs.forEach(async (spec) => {
      const findResult: Spec = await await this.specRepository.findOne<Spec>({
        where: { title: spec.title },
      });
      if (findResult) {
        await this.productSpecRepository.create({
          value: spec.value,
          productId,
          specId: findResult.id,
        });
      } else {
        const specResult: Spec = await this.specRepository.create({
          title: spec.title,
        });

        if (specResult) {
          await this.productSpecRepository.create({
            value: spec.value,
            productId,
            specId: specResult.id,
          });
        }
      }
    });
  }

  public async findById<String>(id: String): Promise<any> {
    let result = await this.productRepository.findOne({ where: { id: id } });
    return result;
  }

  public update<String>(id: String, product: ProductDto): Promise<any> {
    throw new Error("Method not implemented.");
  }
}
