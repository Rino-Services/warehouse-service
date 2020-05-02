import {
  Table,
  Column,
  Model,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { Product } from "./product.model";

@Table
export class ProductInstance extends Model<ProductInstance> {
  @Column
  serialNumber: string;

  @Column
  costUnitPrice: number;

  @Column
  saleUnitPrice: number;

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
}
