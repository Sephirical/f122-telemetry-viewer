import { AllowNull, AutoIncrement, BelongsTo, CreatedAt, Column, DataType, Default, ForeignKey, HasMany, Model, UpdatedAt, PrimaryKey, Table } from "sequelize-typescript";

@Table({ tableName: "served_penalty", timestamps: false })
class ServedPenalty extends Model {
  @PrimaryKey
  @AllowNull(false)
  @Column(DataType.BIGINT.UNSIGNED)
  declare session_uid: number;

  @PrimaryKey
  @AllowNull(false)
  @Column(DataType.INTEGER.UNSIGNED)
  declare username: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare penalty_type: string;

  @AllowNull(false)
  @Column(DataType.TINYINT.UNSIGNED)
  declare index: number;
}

export default ServedPenalty;