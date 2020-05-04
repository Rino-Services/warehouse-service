import { ModelServiceAbstract } from "../interfaces/model-service.interface";
import { Repository } from "sequelize-typescript";
import { DatabaseConnection } from "../../../database.connection";
import { WarehouseStatus } from "../../../models/warehouse/warehouse-status.model";
import { logger } from "../../../common/logger";
import { UuIdGenerator } from "../helpers/uuid-generator.helper";

export class WarehouseStatusService implements ModelServiceAbstract {
  private readonly warehouseStatusRepository: Repository<WarehouseStatus>;
  private readonly db: DatabaseConnection;
  private readonly logScopeMessage: string = "WarehouseStatusService :: ";

  constructor() {
    this.db = new DatabaseConnection();
    const sequelize = this.db.database;
    this.warehouseStatusRepository = sequelize.getRepository(WarehouseStatus);
  }

  public async findAll(): Promise<Array<any>> {
    const result = await this.warehouseStatusRepository.findAll();
    logger.debug(`${this.logScopeMessage} findAll -> ${result}`);
    return result;
  }

  public async warehouseStatusSeed() {
    const count = (await this.findAll()).length;
    if (count < 4) {
      const seeds: any[] = [
        {
          id: UuIdGenerator.generate(),
          initials: "STRG",
          description: "Storage",
        },
        {
          id: UuIdGenerator.generate(),
          initials: "VLDN",
          description: "Validation",
        },
        {
          id: UuIdGenerator.generate(),
          initials: "STCK",
          description: "Stock",
        },
        {
          id: UuIdGenerator.generate(),
          initials: "SOLD",
          description: "Sold",
        },
      ];

      seeds.forEach(async (seed) => {
        if (
          !(await this.warehouseStatusRepository.findOne({
            where: { initials: seed.initials },
          }))
        ) {
          const result = await this.warehouseStatusRepository.create({
            id: seed.id,
            initials: seed.initials,
            description: seed.description,
          });

          logger.debug(
            `${this.logScopeMessage} warehouseStatusSeed -> ${result}`
          );
        }
      });
    }
  }

  addNew(modelDto: any): Promise<any> {
    throw new Error("Method not implemented.");
  }

  findById<T>(id: T): Promise<any> {
    throw new Error("Method not implemented.");
  }

  update<T>(id: T, model: any): Promise<any> {
    throw new Error("Method not implemented.");
  }
}
