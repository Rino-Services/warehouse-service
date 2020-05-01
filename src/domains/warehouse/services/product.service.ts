import { Repository } from "sequelize-typescript";
import { ProductServiceAbstract } from "../interfaces/product-service.interface";
import { Product } from "../../../models/warehouse/product.model";
import { ProductDto } from "../../../models/warehouse/dtos/product.dto";
import { DatabaseConnection } from "../../../database.connection";
import { UuIdGenerator } from "../helpers/uuid-generator.helper";

export class ProductService extends ProductServiceAbstract {
  private productRepository: Repository<Product>;
  private db: DatabaseConnection;
  constructor() {
    super();
    this.db = new DatabaseConnection();
    const sequelize = this.db.database;
    this.productRepository = sequelize.getRepository(Product);
  }

  public async findAll(): Promise<any> {
    const result = await this.productRepository.findAll();
    return result;
  }

  public async addNew(product: ProductDto): Promise<any> {
    let result = await this.productRepository.create({
      id: UuIdGenerator.generate(),
      title: product.title,
      model: product.model,
    });
    return result;
  }
  public async findById(id: string): Promise<any> {
    let result = await this.productRepository.findOne({ where: { id: id } });
    return result;
  }
}
