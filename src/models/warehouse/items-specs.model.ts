import { Table, Column, Model, ForeignKey } from "sequelize-typescript";
import { ProductInstance } from "./product-instance.model";
import { Spec } from "./spec.model";

@Table
export class ItemsSpecs extends Model<ItemsSpecs> {
  @ForeignKey(() => ProductInstance)
  @Column
  itemId: number;

  @ForeignKey(() => Spec)
  @Column
  specId: number;
}
