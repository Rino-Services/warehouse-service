import {
  Table,
  Column,
  Model,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  PrimaryKey,
  BelongsToMany,
} from "sequelize-typescript";
import { Product } from "./product.model";
import { ProductCategory } from "./product-category.model";

@Table
export class Category extends Model<Category> {
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

  @BelongsToMany(() => Product, () => ProductCategory)
  products: Product[];
}
