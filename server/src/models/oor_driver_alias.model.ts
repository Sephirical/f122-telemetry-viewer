import { AllowNull, AutoIncrement, BelongsTo, CreatedAt, Column, DataType, Default, ForeignKey, HasMany, Model, UpdatedAt, PrimaryKey, Table } from "sequelize-typescript";
import OORDriver from "./oor_driver.model";

@Table({ tableName: "oor_driver_alias", timestamps: false })
class OORDriverAlias extends Model {
  @PrimaryKey
  @AllowNull(false)
  @ForeignKey(() => OORDriver)
  @Column(DataType.INTEGER.UNSIGNED)
  declare driver_id: number;

  @PrimaryKey
  @AllowNull(false)
  @Column(DataType.STRING)
  declare alias: string;

  @BelongsTo(() => OORDriver)
  declare driver: OORDriver;
}

export default OORDriverAlias;