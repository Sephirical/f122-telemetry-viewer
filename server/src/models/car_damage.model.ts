import { AllowNull, AutoIncrement, BelongsTo, CreatedAt, Column, DataType, Default, ForeignKey, HasMany, Model, UpdatedAt, PrimaryKey, Table } from "sequelize-typescript";

@Table({ tableName: "car_damage", timestamps: false })
class CarDamage extends Model {
  @PrimaryKey
  @AllowNull(false)
  @AutoIncrement
  @Column(DataType.BIGINT.UNSIGNED)
  declare id: number;
  
  @Column(DataType.BIGINT.UNSIGNED)
  declare session_uid: number;

  @Column(DataType.TINYINT.UNSIGNED)
  declare index: number;

  @Column(DataType.INTEGER.UNSIGNED)
  declare username: number;

  @Column(DataType.INTEGER.UNSIGNED)
  declare frame: number;

  @Column(DataType.FLOAT)
  declare rl_tyrewear: number;

  @Column(DataType.FLOAT)
  declare rr_tyrewear: number;

  @Column(DataType.FLOAT)
  declare fl_tyrewear: number;

  @Column(DataType.FLOAT)
  declare fr_tyrewear: number;

  @Column(DataType.TINYINT.UNSIGNED)
  declare rl_tyredamage: number;

  @Column(DataType.TINYINT.UNSIGNED)
  declare rr_tyredamage: number;

  @Column(DataType.TINYINT.UNSIGNED)
  declare fl_tyredamage: number;

  @Column(DataType.TINYINT.UNSIGNED)
  declare fr_tyredamage: number;

  @Column(DataType.TINYINT.UNSIGNED)
  declare rl_brakedamage: number;

  @Column(DataType.TINYINT.UNSIGNED)
  declare rr_brakedamage: number;

  @Column(DataType.TINYINT.UNSIGNED)
  declare fl_brakedamage: number;

  @Column(DataType.TINYINT.UNSIGNED)
  declare fr_brakedamage: number;

  @Column(DataType.TINYINT.UNSIGNED)
  declare fl_wingdamage: number;

  @Column(DataType.TINYINT.UNSIGNED)
  declare fr_wingdamage: number;

  @Column(DataType.TINYINT.UNSIGNED)
  declare rear_wingdamage: number;

  @Column(DataType.BOOLEAN)
  declare drs_fault: boolean;

  @Column(DataType.BOOLEAN)
  declare ers_fault: boolean;

  @Column(DataType.BOOLEAN)
  declare engine_blown: boolean;

  @Column(DataType.BOOLEAN)
  declare engine_seized: boolean;
}

export default CarDamage;