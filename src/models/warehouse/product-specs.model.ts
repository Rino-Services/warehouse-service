import { Table, Column, Model, ForeignKey } from "sequelize-typescript";
import { Spec } from "./spec.model";
import { Product } from "./product.model";

@Table
export class ProductSpecs extends Model<ProductSpecs> {
  @ForeignKey(() => Product)
  @Column
  productId: string;

  @ForeignKey(() => Spec)
  @Column
  specId: number;

  @Column
  value: string;
}
