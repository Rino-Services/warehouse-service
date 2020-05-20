import { Table, Column, Model, ForeignKey } from "sequelize-typescript";
import { Spec } from "./spec.model";
import { ProductModel } from "./product-model.model";

@Table
export class ProductSpecs extends Model<ProductSpecs> {
  @ForeignKey(() => ProductModel)
  @Column
  productModelId: string;

  @ForeignKey(() => Spec)
  @Column
  specId: number;

  @Column
  value: string;
}
