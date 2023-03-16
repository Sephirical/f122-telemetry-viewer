import { AllowNull, AutoIncrement, BelongsTo, CreatedAt, Column, DataType, Default, ForeignKey, HasMany, Model, UpdatedAt, PrimaryKey, Table } from "sequelize-typescript";

@Table({ tableName: "lap_history", timestamps: false })
class LapHistory extends Model {
  @PrimaryKey
  @AllowNull(false)
  @Column(DataType.BIGINT.UNSIGNED)
  declare session_uid: number;

  @PrimaryKey
  @AllowNull(false)
  @Column(DataType.TINYINT.UNSIGNED)
  declare index: number;

  @PrimaryKey
  @AllowNull(false)
  @Column(DataType.INTEGER.UNSIGNED)
  declare username: number;
  
  @PrimaryKey
  @AllowNull(false)
  @Column(DataType.TINYINT.UNSIGNED)
  declare lap_num: number;

  @Column(DataType.INTEGER.UNSIGNED)
  declare lap_time: number;

  @Column(DataType.SMALLINT.UNSIGNED)
  declare sector1_time: number;

  @Column(DataType.SMALLINT.UNSIGNED)
  declare sector2_time: number;

  @Column(DataType.SMALLINT.UNSIGNED)
  declare sector3_time: number;

  @Column(DataType.TINYINT.UNSIGNED)
  declare lap_valid: number;
}

export default LapHistory;