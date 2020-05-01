import { Model, ForeignKey, Column, Table } from "sequelize-typescript";
import { Category } from "./category.model";
import { Product } from "./product.model";

@Table
export class ProductCategory extends Model<ProductCategory> {
  @ForeignKey(() => Category)
  @Column
  categoryId: string;

  @ForeignKey(() => Product)
  @Column
  productId: string;
}
