import {
  Table,
  Column,
  Model,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  PrimaryKey,
} from "sequelize-typescript";

@Table
export class Product extends Model<Product> {
  @PrimaryKey
  @Column
  id: string;

  @Column
  title: string;

  @Column
  model: string;

  @CreatedAt
  creationDate: Date;

  @UpdatedAt
  updatedOn: Date;

  @DeletedAt
  deletionDate: Date;
}
