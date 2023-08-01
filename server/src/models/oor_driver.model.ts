import { AllowNull, AutoIncrement, BelongsTo, CreatedAt, Column, DataType, Default, ForeignKey, HasMany, Model, UpdatedAt, PrimaryKey, Table } from "sequelize-typescript";
import OORDriverAlias from "./oor_driver_alias.model";

@Table({ tableName: "oor_driver", timestamps: false })
class OORDriver extends Model {
  @PrimaryKey
  @AllowNull(false)
  @AutoIncrement
  @Column(DataType.INTEGER.UNSIGNED)
  declare id: number;

  @Column(DataType.STRING)
  declare name: string;

  @HasMany(() => OORDriverAlias, {
    foreignKey: "driver_id"
  })
  declare aliases: OORDriverAlias[];
}

export default OORDriver;