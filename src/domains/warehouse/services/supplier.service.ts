import { ModelServiceAbstract } from "../interfaces/model-service.interface";
import { Supplier } from "../../../models/warehouse/supplier.model";
import { Repository } from "sequelize-typescript";
import { DatabaseConnection } from "../../../database.connection";
import { logger } from "../../../common/logger";
import { UuIdGenerator } from "../helpers/uuid-generator.helper";
import { SupplierDto } from "../../../models/warehouse/dtos/supplier.dto";

export class SupplierService implements ModelServiceAbstract {
  private supplierRepository: Repository<Supplier>;
  private db: DatabaseConnection;
  private logScopeMessage: string = `SupplierService :: `;
  constructor() {
    this.db = new DatabaseConnection();
    const sequelize = this.db.database;
    this.supplierRepository = sequelize.getRepository(Supplier);
  }

  public async addNew(supplier: SupplierDto): Promise<any> {
    const logMessage = `${this.logScopeMessage} addNew  -> `;
    try {
      const result = await this.supplierRepository.create({
        id: UuIdGenerator.generate(),
        title: supplier.title,
        description: supplier.description,
      });
      logger.debug(`${logMessage} ${JSON.stringify(result)}`);
      return result;
    } catch (err) {
      logger.error(`${logMessage} ${err}`);
      return null;
    }
  }
  findById<T>(id: T): Promise<any> {
    throw new Error("Method not implemented.");
  }
  public async findAll(): Promise<any> {
    return await this.supplierRepository.findAll();
  }
  update<T>(id: T, model: any): Promise<any> {
    throw new Error("Method not implemented.");
  }
}
