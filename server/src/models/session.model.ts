import { AllowNull, AutoIncrement, BelongsTo, CreatedAt, Column, DataType, Default, ForeignKey, HasMany, Model, UpdatedAt, PrimaryKey, Table } from "sequelize-typescript";
import User from "./user.model";

@Table({ tableName: "session", updatedAt: false })
class Session extends Model {
  @PrimaryKey
  @AllowNull(false)
  @Column(DataType.BIGINT.UNSIGNED)
  declare uid: number;

  @PrimaryKey
  @ForeignKey(() => User)
  @AllowNull(false)
  @Column(DataType.INTEGER.UNSIGNED)
  declare username: number;

  @Column(DataType.STRING)
  declare name: string;

  @CreatedAt
  declare created_at: Date;

  @Column(DataType.TINYINT.UNSIGNED)
  declare playercar_index: number;

  @Column(DataType.TINYINT)
  declare track_id: number;

  @Column(DataType.TINYINT.UNSIGNED)
  declare formula: number;

  @Column(DataType.BOOLEAN)
  declare network_game: boolean;

  @Column(DataType.INTEGER.UNSIGNED)
  declare season_link: number;

  @Column(DataType.INTEGER.UNSIGNED)
  declare weekend_link: number;

  @Column(DataType.INTEGER.UNSIGNED)
  declare session_link: number;

  @Column(DataType.TINYINT.UNSIGNED)
  declare gamemode: number;

  @Column(DataType.TINYINT.UNSIGNED)
  declare ruleset: number;

  @Column(DataType.TINYINT.UNSIGNED)
  declare session_type: number;

  @Column(DataType.BOOLEAN)
  declare is_oor: boolean;

  @BelongsTo(() => User, {
    foreignKey: {
      name: "username",
    },
  })
  declare User: User;
}

export default Session;