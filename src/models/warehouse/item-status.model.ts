import {
  Model,
  Table,
  Column,
  ForeignKey,
  DeletedAt,
  UpdatedAt,
  CreatedAt,
} from "sequelize-typescript";
import { WarehouseStatus } from "./warehouse-status.model";
import { ProductInstance } from "./product-instance.model";

@Table
export class ItemStatuses extends Model<ItemStatuses> {
  @ForeignKey(() => WarehouseStatus)
  @Column
  warehouseStatusId: string;

  @ForeignKey(() => ProductInstance)
  @Column
  productInstanceId: number;

  @CreatedAt
  creationDate: Date;

  @UpdatedAt
  updatedOn: Date;

  @DeletedAt
  deletionDate: Date;
}
