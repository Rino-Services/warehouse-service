import {
  Model,
  Table,
  Column,
  Max,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  PrimaryKey,
  BelongsToMany,
} from "sequelize-typescript";
import { ProductInstance } from "./product-instance.model";
import { ItemStatuses } from "./item-status.model";

@Table
export class WarehouseStatus extends Model<WarehouseStatus> {
  @PrimaryKey
  @Column
  id: string;

  /**
   * STRG: Storage
   * VLDN: Validation
   * STCK: Stock
   * SOLD: Sold
   */

  @Max(4)
  @Column
  initials: string;

  @Column
  description: string;

  @CreatedAt
  creationDate: Date;

  @UpdatedAt
  updatedOn: Date;

  @DeletedAt
  deletionDate: Date;

  /**
   * Relationships
   */
  @BelongsToMany(() => ProductInstance, () => ItemStatuses)
  items: ProductInstance[];
}
