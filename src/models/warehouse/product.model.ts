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
  BelongsToMany,
} from "sequelize-typescript";
import { ProductInstance } from "./product-instance.model";
import { Brand } from "./brand.model";
import { Supplier } from "./supplier.model";
import { Category } from "./category.model";
import { ProductCategory } from "./product-category.model";
import { Spec } from "./spec.model";
import { ProductSpecs } from "./product-specs.model";

@Table
export class Product extends Model<Product> {
  @PrimaryKey
  @Column
  id: string;

  @Column
  title: string;

  @Column
  model: string;

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
  @HasMany(() => ProductInstance)
  items: ProductInstance[];

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

  @BelongsToMany(() => Spec, () => ProductSpecs)
  specs: Spec[];
}
