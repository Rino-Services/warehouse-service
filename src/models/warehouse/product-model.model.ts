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
  HasMany,
  PrimaryKey,
} from "sequelize-typescript";
import { Product } from "./product.model";
import { ProductInstance } from "./product-instance.model";
import { Spec } from "./spec.model";
import { ProductSpecs } from "./product-specs.model";
import { PriceHistory } from "./price-history.model";

@Table
export class ProductModel extends Model<ProductModel> {
  @PrimaryKey
  @Column
  id: string;

  @Column
  description: string;

  @Column
  costPrice: number;

  @Column
  datePublished: Date;

  @CreatedAt
  creationDate: Date;

  @UpdatedAt
  updatedOn: Date;

  @DeletedAt
  deletionDate: Date;

  @ForeignKey(() => Product)
  @Column
  productId: string;

  @BelongsTo(() => Product)
  product: Product;

  /**
   * Relationships
   */
  @HasMany(() => ProductInstance)
  items: ProductInstance[];

  @BelongsToMany(() => Spec, () => ProductSpecs)
  specs: Spec[];

  @HasMany(() => PriceHistory)
  priceHistory: PriceHistory[];
}
