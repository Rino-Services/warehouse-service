import { ModelServiceAbstract } from "../interfaces/model-service.interface";
import { ProductModel } from "../../../models/warehouse/product-model.model";
import { Repository } from "sequelize-typescript";
import { DatabaseConnection } from "../../../database.connection";
import { logger } from "../../../common/logger";

export class ProductModelService implements ModelServiceAbstract {
  private productModelRepository: Repository<ProductModel>;
  private db: DatabaseConnection;

  private readonly logScopeMessage: string = "ProductModelService :: ";

  constructor() {
    this.db = new DatabaseConnection();
    const sequelize = this.db.database;
    this.productModelRepository = sequelize.getRepository(ProductModel);
  }

  addNew(modelDto: any): Promise<any> {
    throw new Error("Method not implemented.");
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
