import {
  Table,
  Column,
  Model,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  PrimaryKey,
  HasMany,
  BelongsTo,
  ForeignKey,
} from "sequelize-typescript";
import { Product } from "./product.model";

@Table
export class Supplier extends Model<Supplier> {
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
