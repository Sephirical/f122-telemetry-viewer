import { AllowNull, AutoIncrement, BelongsTo, CreatedAt, Column, DataType, Default, ForeignKey, HasMany, Model, UpdatedAt, PrimaryKey, Table } from "sequelize-typescript";

@Table({ tableName: "session_marshal_zone", timestamps: false })
class SessionMarshalZone extends Model {
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

  @Column(DataType.FLOAT)
  declare zone_start: number;

  @Column(DataType.TINYINT.UNSIGNED)
  declare zone_flag: number;

  @Column(DataType.DATE)
  declare time: Date;
}

export default SessionMarshalZone;