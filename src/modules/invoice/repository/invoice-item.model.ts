import { BelongsTo, Column, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import InvoiceModel from "./invoice.model";

@Table({
  tableName: "products",
  timestamps: false,
})
export default class InvoiceItemModel extends Model {
  @PrimaryKey
  @Column({ allowNull: false })
  declare id: string;

  @BelongsTo(() => InvoiceModel, { foreignKey: "invoice_id" })
  invoice: InvoiceModel;
  
  @Column({ allowNull: false })
  declare name: string;
  
  @Column({ allowNull: false })
  declare price: number;
}