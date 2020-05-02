import { ModelServiceAbstract } from "../interfaces/model-service.interface";
import { Repository } from "sequelize-typescript";
import { Spec } from "../../../models/warehouse/spec.model";
import { DatabaseConnection } from "../../../database.connection";
import { logger } from "../../../common/logger";

export class SpecService implements ModelServiceAbstract {
  private readonly specRepository: Repository<Spec>;
  private readonly db: DatabaseConnection;

  private readonly logScopeMessage: string = "SpecService :: ";

  constructor() {
    this.db = new DatabaseConnection();
    const sequelize = this.db.database;
    this.specRepository = sequelize.getRepository(Spec);
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
