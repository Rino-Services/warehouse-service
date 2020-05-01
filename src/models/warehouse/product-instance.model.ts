import {
  Table,
  Column,
  Model,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  ForeignKey,
  BelongsTo,
  BelongsToMany,
} from "sequelize-typescript";
import { Product } from "./product.model";
import { Spec } from "./spec.model";
import { ItemsSpecs } from "./items-specs.model";

@Table
export class ProductInstance extends Model<ProductInstance> {
  @Column
  serialNumber: string;

  @Column
  title: string;

  @Column
  model: string;

  @Column
  description: string;

  @Column
  costPrice: number;

  @Column
  salePrice: number;

  @CreatedAt
  creationDate: Date;

  @UpdatedAt
  updatedOn: Date;

  @DeletedAt
  deletionDate: Date;

  /**
   * relationships
   */
  @ForeignKey(() => Product)
  @Column
  productId: string;

  @BelongsTo(() => Product)
  product: Product;

  @BelongsToMany(() => Spec, () => ItemsSpecs)
  specs: Spec[];
}
