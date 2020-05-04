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
import { WarehouseStatus } from "./warehouse-status.model";
import { ItemStatuses } from "./item-status.model";

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

  @BelongsToMany(() => WarehouseStatus, () => ItemStatuses)
  itemStatus: WarehouseStatus[];
}
