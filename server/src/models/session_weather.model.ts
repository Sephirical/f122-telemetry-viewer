import { AllowNull, AutoIncrement, BelongsTo, CreatedAt, Column, DataType, Default, ForeignKey, HasMany, Model, UpdatedAt, PrimaryKey, Table } from "sequelize-typescript";

@Table({ tableName: "session_weather", timestamps: false })
class SessionWeather extends Model {
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

  @Column(DataType.TINYINT.UNSIGNED)
  declare time_offset: number;

  @Column(DataType.TINYINT.UNSIGNED)
  declare weather: number;

  @Column(DataType.TINYINT)
  declare track_temperature: number;

  @Column(DataType.TINYINT)
  declare track_delta: number;

  @Column(DataType.TINYINT)
  declare air_temperature: number;

  @Column(DataType.TINYINT)
  declare air_delta: number;

  @Column(DataType.TINYINT.UNSIGNED)
  declare rain_percentage: number;

  @Column(DataType.DATE)
  declare time: Date;
}

export default SessionWeather;