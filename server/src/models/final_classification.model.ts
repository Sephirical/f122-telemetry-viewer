import { AllowNull, AutoIncrement, BelongsTo, CreatedAt, Column, DataType, Default, ForeignKey, HasMany, Model, UpdatedAt, PrimaryKey, Table } from "sequelize-typescript";
import Participants from "./participants.model";
import Session from "./session.model";
import User from "./user.model";

@Table({ tableName: "final_classification", timestamps: false })
class FinalClassfication extends Model {
  @PrimaryKey
  @ForeignKey(() => Session)
  @AllowNull(false)
  @Column(DataType.BIGINT.UNSIGNED)
  declare session_uid: number;

  @PrimaryKey
  @AllowNull(false)
  @Column(DataType.TINYINT.UNSIGNED)
  declare index: number;

  @PrimaryKey
  @ForeignKey(() => User)
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

  @BelongsTo(() => Session, {
    foreignKey: {
      name: "session_uid",
    },
  })
  declare Session: Session;

  @BelongsTo(() => User, {
    foreignKey: {
      name: "username",
    },
  })
  declare User: User;

  @HasMany(() => Participants)
  declare Participants: Participants[];
}

export default FinalClassfication;