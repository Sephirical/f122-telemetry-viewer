import { AllowNull, AutoIncrement, BelongsTo, CreatedAt, Column, DataType, Default, ForeignKey, HasMany, Model, UpdatedAt, PrimaryKey, Table } from "sequelize-typescript";

@Table({ tableName: "event_penalty", timestamps: false })
class EventPenalty extends Model {
  @PrimaryKey
  @AllowNull(false)
  @AutoIncrement
  @Column(DataType.BIGINT.UNSIGNED)
  declare id: number;

  @Column(DataType.INTEGER.UNSIGNED)
  declare username: number;
  
  @Column(DataType.BIGINT.UNSIGNED)
  declare session_uid: number;

  @Column(DataType.TINYINT.UNSIGNED)
  declare index: number;

  @Column(DataType.TINYINT.UNSIGNED)
  declare penalty_type: number;

  @Column(DataType.TINYINT.UNSIGNED)
  declare infringement_type: number;

  @Column(DataType.TINYINT.UNSIGNED)
  declare other_index: number;

  @Column(DataType.TINYINT.UNSIGNED)
  declare time: number;

  @Column(DataType.TINYINT.UNSIGNED)
  declare lap_num: number;

  @Column(DataType.TINYINT.UNSIGNED)
  declare places_gained: number;

  @Column(DataType.INTEGER.UNSIGNED)
  declare frame: number;
}

export default EventPenalty;