import { AllowNull, AutoIncrement, BelongsTo, CreatedAt, Column, DataType, Default, ForeignKey, HasMany, Model, UpdatedAt, PrimaryKey, Table } from "sequelize-typescript";

@Table({ tableName: "final_classification_tyrestint", timestamps: false })
class FinalClassficiationTyreStint extends Model {
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
  declare stint: number;

  @Column(DataType.TINYINT.UNSIGNED)
  declare tyre_actual: number;

  @Column(DataType.TINYINT.UNSIGNED)
  declare tyre_visual: number;

  @Column(DataType.TINYINT.UNSIGNED)
  declare tyre_endlap: number;
}

export default FinalClassficiationTyreStint;