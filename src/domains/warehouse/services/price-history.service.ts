import { ModelServiceAbstract } from "../interfaces/model-service.interface";
import { Repository } from "sequelize-typescript";
import { DatabaseConnection } from "../../../database.connection";
import { PriceHistory } from "../../../models/warehouse/price-history.model";
import { PriceHistoryDto } from "../../../models/warehouse/dtos/price-history.dto";
import { logger } from "../../../common/logger";

export class PriceHistoryService implements ModelServiceAbstract {
  private priceHistoryRepository: Repository<PriceHistory>;
  private db: DatabaseConnection;
  constructor() {
    this.db = new DatabaseConnection();
    const sequelize = this.db.database;
    this.priceHistoryRepository = sequelize.getRepository(PriceHistory);
  }

  public async addNew(priceHistoryDto: PriceHistoryDto): Promise<any> {
    try {
      // get priceHistory by productModelId and filter by isCurrent
      const currentPrice: PriceHistory = await this.priceHistoryRepository.findOne(
        {
          where: {
            productModelId: priceHistoryDto.productModelId,
            isCurrent: true,
          },
        }
      );
      // is the firstOne? (is firstone when result set comes null/empty),
      if (!currentPrice) {
        
        const result = await this.priceHistoryRepository.create({
          price: this.setNewPrice(0, priceHistoryDto.oldPrice), // price: set as default price
          percentageApplied: priceHistoryDto.percentageApplied, // percentageApplied: 0
          oldPrice: priceHistoryDto.oldPrice, // oldPrice: costPrice
          isCurrent: true, // isCurrent: true
        });

        logger.debug(`${result}`);
        return result;
      } else {
        
        const result = await this.priceHistoryRepository.create({
          price: this.setNewPrice(
            priceHistoryDto.percentageApplied,
            currentPrice.price
          ), // price: set as default price
          percentageApplied: priceHistoryDto.percentageApplied, // percentageApplied: 0
          oldPrice: currentPrice.price, // oldPrice: costPrice
          isCurrent: true, // isCurrent: true
        });

        // update oldPrice, isCurrent = false
        const modelToUpdate = {
          values: {
            isCurrent: false,
          },
          options: {
            where: { id: currentPrice.id },
          },
        };

        this.update(0, modelToUpdate);

        logger.debug(`${result}`);
        return result;
      }
    } catch (err) {
      logger.error(`${err}`);
      return null;
    }
  }
  findById<T>(id: T): Promise<any> {
    throw new Error("Method not implemented.");
  }
  findAll(): Promise<any> {
    throw new Error("Method not implemented.");
  }
  public async update<T>(id: T, model: any): Promise<any> {
    try {
      const result = await this.priceHistoryRepository.update(
        model.values,
        model.options
      );
      logger.debug(`${result}`);
    } catch (err) {
      logger.error(`${err}`);
    }
  }

  private setNewPrice(percentageApplied: number, oldPrice: number): number {
    return oldPrice * percentageApplied + oldPrice;
  }
}
