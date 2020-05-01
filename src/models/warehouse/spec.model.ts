import {
  Table,
  Column,
  Model,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  BelongsToMany,
} from "sequelize-typescript";
import { ItemsSpecs } from "./items-specs.model";
import { ProductInstance } from "./product-instance.model";

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

  @BelongsToMany(() => ProductInstance, () => ItemsSpecs)
  items: ProductInstance[];
}
