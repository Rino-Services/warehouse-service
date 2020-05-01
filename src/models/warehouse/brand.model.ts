import {
  Table,
  Column,
  Model,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  PrimaryKey,
  HasMany,
} from "sequelize-typescript";
import { Product } from "./product.model";

@Table
export class Brand extends Model<Brand> {
  @PrimaryKey
  @Column
  id: string;

  @Column
  title: string;

  @Column
  description: string;

  @CreatedAt
  creationDate: Date;

  @UpdatedAt
  updatedOn: Date;

  @DeletedAt
  deletionDate: Date;

  /**
   * relationships
   */
  @HasMany(() => Product)
  products: Product[];
}
