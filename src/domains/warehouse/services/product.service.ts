import { Repository } from "sequelize-typescript";
import { ModelServiceAbstract } from "../interfaces/model-service.interface";
import { Product } from "../../../models/warehouse/product.model";
import { ProductDto } from "../../../models/warehouse/dtos/product.dto";
import { DatabaseConnection } from "../../../database.connection";
import { UuIdGenerator } from "../helpers/uuid-generator.helper";
import { logger } from "../../../common/logger";
import { Inject } from "typescript-ioc";
import { ProductInstanceService } from "./product-instance.service";

export class ProductService implements ModelServiceAbstract {
  @Inject productInstanceService: ProductInstanceService;

  private productRepository: Repository<Product>;
  private db: DatabaseConnection;

  private readonly logScopeMessage: string = "ProductService :: ";

  constructor() {
    this.db = new DatabaseConnection();
    const sequelize = this.db.database;
    this.productRepository = sequelize.getRepository(Product);
  }

  public async findAll(): Promise<any> {
    const result = await this.productRepository.findAll();
    return result;
  }

  public async addNew(product: ProductDto): Promise<any> {
    const logMessage: string = `${this.logScopeMessage} addNew ->`;
    try {
      let result = await this.productRepository.create({
        id: UuIdGenerator.generate(),
        title: product.title,
        baseImageUrl: product.baseImageUrl,
        description: product.description,
        brandId: product.brandId,
        supplierId: product.supplierId,
      });

      logger.debug(` ${logMessage} ${JSON.stringify(result)}`);

      return result;
    } catch (err) {
      logger.error(`${logMessage} -> ${err}`);
    }
  }

  public async findById<String>(id: String): Promise<any> {
    let result = await this.productRepository.findOne({ where: { id: id } });
    return result;
  }

  public update<String>(id: String, product: ProductDto): Promise<any> {
    throw new Error("Method not implemented.");
  }
}
