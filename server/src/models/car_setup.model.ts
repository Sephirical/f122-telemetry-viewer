import { AllowNull, AutoIncrement, BelongsTo, CreatedAt, Column, DataType, Default, ForeignKey, HasMany, Model, UpdatedAt, PrimaryKey, Table } from "sequelize-typescript";

@Table({ tableName: "car_setup", timestamps: false })
class CarSetup extends Model {
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
  declare front_wing: number;

  @Column(DataType.TINYINT.UNSIGNED)
  declare rear_wing: number;

  @Column(DataType.TINYINT.UNSIGNED)
  declare diff_on: number;

  @Column(DataType.TINYINT.UNSIGNED)
  declare diff_off: number;

  @Column(DataType.FLOAT)
  declare front_camber: number;

  @Column(DataType.FLOAT)
  declare rear_camber: number;

  @Column(DataType.FLOAT)
  declare front_toe: number;

  @Column(DataType.FLOAT)
  declare rear_toe: number;

  @Column(DataType.TINYINT.UNSIGNED)
  declare front_suspension: number;

  @Column(DataType.TINYINT.UNSIGNED)
  declare rear_suspension: number;

  @Column(DataType.INTEGER.UNSIGNED)
  declare front_arb: number;

  @Column(DataType.TINYINT.UNSIGNED)
  declare rear_arb: number;

  @Column(DataType.TINYINT.UNSIGNED)
  declare front_height: number;

  @Column(DataType.TINYINT.UNSIGNED)
  declare rear_height: number;

  @Column(DataType.TINYINT.UNSIGNED)
  declare brake_pressure: number;

  @Column(DataType.TINYINT.UNSIGNED)
  declare brake_bias: number;

  @Column(DataType.INTEGER.UNSIGNED)
  declare frame: number;

  @Column(DataType.DATE)
  declare time: Date;

  @Column(DataType.FLOAT)
  declare rl_pressure: number;

  @Column(DataType.FLOAT)
  declare rr_pressure: number;

  @Column(DataType.FLOAT)
  declare fl_pressure: number;

  @Column(DataType.FLOAT)
  declare fr_pressure: number;

  @Column(DataType.FLOAT)
  declare fuel_load: number;
}

export default CarSetup;