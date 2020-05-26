import { Sequelize } from "sequelize-typescript";
import { config } from "dotenv";
import { logger } from "./common/logger";

// Entities/Models
import { Supplier } from "./models/warehouse/supplier.model";
import { Product } from "./models/warehouse/product.model";
import { Category } from "./models/warehouse/category.model";
import { Brand } from "./models/warehouse/brand.model";
import { ProductInstance } from "./models/warehouse/product-instance.model";
import { Spec } from "./models/warehouse/spec.model";
import { ProductSpecs } from "./models/warehouse/product-specs.model";
import { ProductCategory } from "./models/warehouse/product-category.model";
import { ItemStatuses } from "./models/warehouse/item-status.model";
import { WarehouseStatus } from "./models/warehouse/warehouse-status.model";
import { ProductModel } from "./models/warehouse/product-model.model";
import { PriceHistory } from "./models/warehouse/price-history.model";

export class DatabaseConnection {
  public database: Sequelize;

  db: string;
  user: string;
  password: string;
  host: string;
  port: number;
  //   maxPool: number;
  //   minPool: number;

  constructor() {
    config({ path: ".env" });

    this.db = process.env.PGDATABASE;
    this.user = process.env.PGUSER;
    this.password = process.env.PGPASSWORD;
    this.host = process.env.PGHOST;
    this.port = Number(process.env.PGPORT) || 1;

    this.database = new Sequelize({
      database: this.db,
      dialect: "postgres",
      username: this.user,
      password: this.password,
      host: this.host,
      port: this.port,
      repositoryMode: true,
      models: [
        Supplier,
        Category,
        Brand,
        Product,
        ProductModel,
        ProductCategory,
        ProductInstance,
        Spec,
        ProductSpecs,
        WarehouseStatus,
        ItemStatuses,
        PriceHistory,
      ], // or [Player, Team],
    });
  }

  public async connect(): Promise<any> {
    try {
      await this.database.authenticate();
      logger.info(`Database ${this.db} connected`);

      await this.database.sync({});
      logger.info(`Database ${this.db} is sync now`);
    } catch (err) {
      logger.error(`Database ${this.db} has not been connected`);
    } finally {
      await this.disconnect();
    }
  }

  public async disconnect(): Promise<any> {
    await this.database.close();
    logger.info(`Database ${this.db} has been disconnected`);
  }
}
