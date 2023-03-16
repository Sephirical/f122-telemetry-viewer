import { AllowNull, AutoIncrement, BelongsTo, CreatedAt, Column, DataType, Default, ForeignKey, HasMany, Model, UpdatedAt, PrimaryKey, Table } from "sequelize-typescript";

@Table({ tableName: "final_classification", timestamps: false })
class FinalClassficiation extends Model {
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

  @Column(DataType.TINYINT.UNSIGNED)
  declare position: number;

  @Column(DataType.TINYINT.UNSIGNED)
  declare num_laps: number;

  @Column(DataType.TINYINT.UNSIGNED)
  declare grid_position: number;

  @Column(DataType.TINYINT.UNSIGNED)
  declare points: number;

  @Column(DataType.TINYINT.UNSIGNED)
  declare num_pitstops: number;

  @Column(DataType.TINYINT.UNSIGNED)
  declare result_status: number;

  @Column(DataType.INTEGER.UNSIGNED)
  declare best_laptime: number;

  @Column(DataType.DOUBLE)
  declare total_racetime: number;

  @Column(DataType.TINYINT.UNSIGNED)
  declare penalties_time: number;

  @Column(DataType.TINYINT.UNSIGNED)
  declare num_penalties: number;

  @Column(DataType.TINYINT.UNSIGNED)
  declare num_tyrestints: number;
}

export default FinalClassficiation;