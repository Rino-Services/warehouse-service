import {
  Table,
  Column,
  Model,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  PrimaryKey,
  BelongsTo,
  ForeignKey,
  BelongsToMany,
} from "sequelize-typescript";
import { Brand } from "./brand.model";
import { Supplier } from "./supplier.model";
import { Category } from "./category.model";
import { ProductCategory } from "./product-category.model";

@Table
export class Product extends Model<Product> {
  @PrimaryKey
  @Column
  id: string;

  @Column
  title: string;

  @Column
  baseImageUrl: string;

  @Column
  description: string;

  @Column
  datePublished: Date;

  @CreatedAt
  creationDate: Date;

  @UpdatedAt
  updatedOn: Date;

  @DeletedAt
  deletionDate: Date;

  /**
   * relationships
   */

  @ForeignKey(() => Brand)
  @Column
  brandId: string;

  @BelongsTo(() => Brand)
  brand: Brand;

  @ForeignKey(() => Supplier)
  @Column
  supplierId: string;

  @BelongsTo(() => Supplier)
  supplier: Supplier;

  @BelongsToMany(() => Category, () => ProductCategory)
  categories: Category[];
}
