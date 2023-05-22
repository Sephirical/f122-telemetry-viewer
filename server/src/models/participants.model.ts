import { AllowNull, AutoIncrement, BelongsTo, CreatedAt, Column, DataType, Default, ForeignKey, HasMany, Model, UpdatedAt, PrimaryKey, Table } from "sequelize-typescript";
import FinalClassfication from "./final_classification.model";
import Session from "./session.model";
import User from "./user.model";

@Table({ tableName: "participants", timestamps: false })
class Participants extends Model {
  @PrimaryKey
  @ForeignKey(() => Session)
  @ForeignKey(() => FinalClassfication)
  @AllowNull(false)
  @Column(DataType.BIGINT.UNSIGNED)
  declare session_uid: number;

  @PrimaryKey
  @ForeignKey(() => FinalClassfication)
  @AllowNull(false)
  @Column(DataType.TINYINT.UNSIGNED)
  declare index: number;

  @PrimaryKey
  @ForeignKey(() => User)
  @ForeignKey(() => FinalClassfication)
  @AllowNull(false)
  @Column(DataType.INTEGER.UNSIGNED)
  declare username: number;

  @Column(DataType.BOOLEAN)
  declare is_ai: boolean;

  @Column(DataType.TINYINT.UNSIGNED)
  declare driver_id: number;

  @Column(DataType.TINYINT.UNSIGNED)
  declare network_id: number;

  @Column(DataType.TINYINT.UNSIGNED)
  declare team_id: number;

  @Column(DataType.BOOLEAN)
  declare is_my_team: boolean;

  @Column(DataType.TINYINT.UNSIGNED)
  declare race_number: number;

  @Column(DataType.TINYINT.UNSIGNED)
  declare nationality: number;

  @Column(DataType.STRING(48))
  declare name: string;

  @Column(DataType.TINYINT.UNSIGNED)
  declare telemetry: number;

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
  declare FinalClassification: FinalClassfication;
}

export default Participants;