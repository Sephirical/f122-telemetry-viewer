import { AllowNull, AutoIncrement, BelongsTo, CreatedAt, Column, DataType, Default, ForeignKey, HasMany, Model, UpdatedAt, PrimaryKey, Table } from "sequelize-typescript";

@Table({ tableName: "event_speedtrap", timestamps: false })
class EventSpeedtrap extends Model {
  @PrimaryKey
  @AllowNull(false)
  @AutoIncrement
  @Column(DataType.BIGINT.UNSIGNED)
  declare id: number;

  @Column(DataType.INTEGER.UNSIGNED)
  declare username: number;
  
  @Column(DataType.BIGINT.UNSIGNED)
  declare session_uid: number;

  @Column(DataType.INTEGER.UNSIGNED)
  declare frame: number;

  @Column(DataType.TINYINT.UNSIGNED)
  declare index: number;

  @Column(DataType.DATE)
  declare time: Date;

  @Column(DataType.FLOAT)
  declare speed: number;
}

export default EventSpeedtrap;