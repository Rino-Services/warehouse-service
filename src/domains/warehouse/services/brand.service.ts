import { ModelServiceAbstract } from "../interfaces/model-service.interface";
import { Repository } from "sequelize-typescript";
import { Brand } from "../../../models/warehouse/brand.model";
import { DatabaseConnection } from "../../../database.connection";
import { BrandDto } from "../../../models/warehouse/dtos/brand.dto";
import { UuIdGenerator } from "../helpers/uuid-generator.helper";
import { logger } from "../../../common/logger";

export class BrandService implements ModelServiceAbstract {
  private readonly brandRepository: Repository<Brand>;
  private readonly db: DatabaseConnection;

  private readonly logScopeMessage: string = `BrandService ::`;

  constructor() {
    this.db = new DatabaseConnection();
    const sequelize = this.db.database;
    this.brandRepository = sequelize.getRepository(Brand);
  }

  public async addNew(brandModel: BrandDto): Promise<any> {
    const logMessage: string = `${this.logScopeMessage} -> `;
    try {
      const result = await this.brandRepository.create({
        id: UuIdGenerator.generate(),
        title: brandModel.title,
        description: brandModel.description,
      });
      logger.debug(`${logMessage} -> ${result}`);
      return result;
    } catch (err) {
      logger.error(`${logMessage} -> ${err}`);
      return null;
    }
  }
  findById<T>(id: T): Promise<any> {
    throw new Error("Method not implemented.");
  }
  public async findAll(): Promise<any> {
    const result = await this.brandRepository.findAll();
    return result;
  }
  update<T>(id: T, model: any): Promise<any> {
    throw new Error("Method not implemented.");
  }
}
