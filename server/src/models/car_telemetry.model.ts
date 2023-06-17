import { AllowNull, AutoIncrement, BelongsTo, CreatedAt, Column, DataType, Default, ForeignKey, HasMany, Model, UpdatedAt, PrimaryKey, Table } from "sequelize-typescript";

@Table({ tableName: "car_telemetry", timestamps: false })
class CarTelemetry extends Model {
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
  @Column(DataType.INTEGER.UNSIGNED)
  declare frame: number;

  @Column(DataType.SMALLINT.UNSIGNED)
  declare speed: number;

  @Column(DataType.FLOAT)
  declare throttle: number;

  @Column(DataType.FLOAT)
  declare steer: number;

  @Column(DataType.FLOAT)
  declare brake: number;

  @Column(DataType.TINYINT.UNSIGNED)
  declare gear: number;

  @Column(DataType.BOOLEAN)
  declare drs: boolean;

  @Column(DataType.SMALLINT.UNSIGNED)
  declare engine_temperature: number;

  @Column(DataType.SMALLINT.UNSIGNED)
  declare rl_brake_temperature: number;

  @Column(DataType.SMALLINT.UNSIGNED)
  declare rr_brake_temperature: number;

  @Column(DataType.SMALLINT.UNSIGNED)
  declare fl_brake_temperature: number;

  @Column(DataType.SMALLINT.UNSIGNED)
  declare fr_brake_temperature: number;

  @Column(DataType.TINYINT.UNSIGNED)
  declare rl_tyre_surface_temperature: number;

  @Column(DataType.TINYINT.UNSIGNED)
  declare rr_tyre_surface_temperature: number;

  @Column(DataType.TINYINT.UNSIGNED)
  declare fl_tyre_surface_temperature: number;

  @Column(DataType.TINYINT.UNSIGNED)
  declare fr_tyre_surface_temperature: number;

  @Column(DataType.TINYINT.UNSIGNED)
  declare rl_tyre_core_temperature: number;

  @Column(DataType.TINYINT.UNSIGNED)
  declare rr_tyre_core_temperature: number;

  @Column(DataType.TINYINT.UNSIGNED)
  declare fl_tyre_core_temperature: number;

  @Column(DataType.TINYINT.UNSIGNED)
  declare fr_tyre_core_temperature: number;

  @Column(DataType.TINYINT.UNSIGNED)
  declare rl_surface: number;

  @Column(DataType.TINYINT.UNSIGNED)
  declare rr_surface: number;

  @Column(DataType.TINYINT.UNSIGNED)
  declare fl_surface: number;

  @Column(DataType.TINYINT.UNSIGNED)
  declare fr_surface: number;
}

export default CarTelemetry;