import { ProductDto } from "../../../models/warehouse/dtos/product.dto";

export abstract class ProductServiceAbstract {
  public abstract async addNew(product: ProductDto): Promise<any>;
  public abstract async findById(id: string): Promise<any>;
  public abstract async findAll(): Promise<any>;
}
