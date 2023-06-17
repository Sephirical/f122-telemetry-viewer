import { AllowNull, AutoIncrement, BelongsTo, CreatedAt, Column, DataType, Default, ForeignKey, HasMany, Model, UpdatedAt, PrimaryKey, Table } from "sequelize-typescript";

@Table({ tableName: "session_data", timestamps: false })
class SessionData extends Model {
  @PrimaryKey
  @AllowNull(false)
  @Column(DataType.BIGINT.UNSIGNED)
  declare session_uid: number;

  @PrimaryKey
  @AllowNull(false)
  @Column(DataType.INTEGER.UNSIGNED)
  declare frame: number;

  @PrimaryKey
  @AllowNull(false)
  @Column(DataType.INTEGER.UNSIGNED)
  declare username: number;

  @Column(DataType.TINYINT.UNSIGNED)
  declare weather: number;

  @Column(DataType.TINYINT)
  declare track_temperature: number;

  @Column(DataType.TINYINT)
  declare air_temperature: number;

  @Column(DataType.TINYINT.UNSIGNED)
  declare total_laps: number;

  @Column(DataType.SMALLINT.UNSIGNED)
  declare track_length: number;

  @Column(DataType.SMALLINT.UNSIGNED)
  declare session_time_left: number;

  @Column(DataType.SMALLINT.UNSIGNED)
  declare session_duration: number;

  @Column(DataType.TINYINT.UNSIGNED)
  declare num_marshal_zones: number;

  @Column(DataType.TINYINT.UNSIGNED)
  declare safety_car_status: number;

  @Column(DataType.TINYINT.UNSIGNED)
  declare num_weather_forecast_samples: number;

  @Column(DataType.DATE)
  declare time: Date;

  @Column(DataType.TINYINT.UNSIGNED)
  declare session_type: number;
}

export default SessionData;