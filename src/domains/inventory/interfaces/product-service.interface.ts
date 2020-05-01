import { ProductDto } from "../../../models/inventory/product.dto";

export abstract class ProductServiceAbstract {
  public abstract async addNew(product: ProductDto): Promise<any>;
  public abstract async findById(id: string): Promise<any>;
  public abstract async findAll(): Promise<any>;
}
