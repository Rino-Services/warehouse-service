import {
  Table,
  Column,
  Model,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  BelongsToMany,
} from "sequelize-typescript";
import { ProductSpecs } from "./product-specs.model";
import { Product } from "./product.model";

@Table
export class Spec extends Model<Spec> {
  @Column
  title: string;

  @CreatedAt
  creationDate: Date;

  @UpdatedAt
  updatedOn: Date;

  @DeletedAt
  deletionDate: Date;

  @BelongsToMany(() => Product, () => ProductSpecs)
  products: Product[];
}
