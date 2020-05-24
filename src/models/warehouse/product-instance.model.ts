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
import { WarehouseStatus } from "./warehouse-status.model";
import { ItemStatuses } from "./item-status.model";
import { ProductModel } from "./product-model.model";

@Table
export class ProductInstance extends Model<ProductInstance> {
  @Column
  serialNumber: string;

  @CreatedAt
  creationDate: Date;

  @UpdatedAt
  updatedOn: Date;

  @DeletedAt
  deletionDate: Date;

  /**
   * relationships
   */
  @ForeignKey(() => ProductModel)
  @Column
  productModelId: string;

  @BelongsTo(() => ProductModel)
  productModel: ProductModel;

  @BelongsToMany(() => WarehouseStatus, () => ItemStatuses)
  itemStatus: WarehouseStatus[];
}
