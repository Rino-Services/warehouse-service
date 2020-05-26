import {
  Column,
  DeletedAt,
  UpdatedAt,
  CreatedAt,
  ForeignKey,
  Table,
  BelongsTo,
  Model,
} from "sequelize-typescript";
import { ProductModel } from "./product-model.model";

@Table
export class PriceHistory extends Model<PriceHistory> {
  @Column
  price: number;

  @Column
  percentageApplied: number;

  @Column
  oldPrice: number;

  @Column
  isCurrent: boolean;

  @CreatedAt
  creationDate: Date;

  @UpdatedAt
  updatedOn: Date;

  @DeletedAt
  deletionDate: Date;

  @ForeignKey(() => ProductModel)
  @Column
  productModelId: string;

  @BelongsTo(() => ProductModel)
  productModel: ProductModel;
}
