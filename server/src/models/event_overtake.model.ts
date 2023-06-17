import { AllowNull, AutoIncrement, BelongsTo, CreatedAt, Column, DataType, Default, ForeignKey, HasMany, Model, UpdatedAt, PrimaryKey, Table } from "sequelize-typescript";

@Table({ tableName: "event_overtake", timestamps: false })
class EventOvertake extends Model {
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
  declare overtake_index: number;

  @Column(DataType.TINYINT.UNSIGNED)
  declare overtaken_index: number;

  @Column(DataType.DATE)
  declare time: Date;
}

export default EventOvertake;