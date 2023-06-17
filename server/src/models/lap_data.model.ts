import { AllowNull, AutoIncrement, BelongsTo, CreatedAt, Column, DataType, Default, ForeignKey, HasMany, Model, UpdatedAt, PrimaryKey, Table } from "sequelize-typescript";

@Table({ tableName: "lap_data", timestamps: false })
class LapData extends Model {
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

  @Column(DataType.INTEGER.UNSIGNED)
  declare last_laptime: number;

  @Column(DataType.INTEGER.UNSIGNED)
  declare current_laptime: number;

  @Column(DataType.SMALLINT.UNSIGNED)
  declare sector1_time: number;

  @Column(DataType.SMALLINT.UNSIGNED)
  declare sector2_time: number;

  @Column(DataType.FLOAT)
  declare lap_distance: number;

  @Column(DataType.FLOAT)
  declare total_distance: number;

  @Column(DataType.FLOAT)
  declare safetycar_delta: number;

  @Column(DataType.TINYINT.UNSIGNED)
  declare car_position: number;

  @Column(DataType.TINYINT.UNSIGNED)
  declare currentlap_num: number;

  @Column(DataType.TINYINT.UNSIGNED)
  declare pit_status: number;

  @Column(DataType.TINYINT.UNSIGNED)
  declare num_pitstops: number;

  @Column(DataType.TINYINT.UNSIGNED)
  declare sector: number;

  @Column(DataType.BOOLEAN)
  declare currentlap_invalid: boolean;

  @Column(DataType.TINYINT.UNSIGNED)
  declare penalties: number;

  @Column(DataType.TINYINT.UNSIGNED)
  declare warnings: number;

  @Column(DataType.TINYINT.UNSIGNED)
  declare num_unserved_drivethrough_pens: number;

  @Column(DataType.TINYINT.UNSIGNED)
  declare num_unserved_stopgo_pens: number;

  @Column(DataType.TINYINT.UNSIGNED)
  declare grid_position: number;

  @Column(DataType.TINYINT.UNSIGNED)
  declare driver_status: number;

  @Column(DataType.TINYINT.UNSIGNED)
  declare result_status: number;

  @Column(DataType.BOOLEAN)
  declare pitlane_timer_active: boolean;

  @Column(DataType.SMALLINT.UNSIGNED)
  declare pitlane_time: number;

  @Column(DataType.SMALLINT.UNSIGNED)
  declare pitstop_timer: number;

  @Column(DataType.BOOLEAN)
  declare pitstop_serve_pen: boolean;

  @Column(DataType.DATE)
  declare time: Date;

  @Column(DataType.SMALLINT.UNSIGNED)
  declare delta_to_front: number;

  @Column(DataType.SMALLINT.UNSIGNED)
  declare delta_to_leader: number;

  @Column(DataType.TINYINT.UNSIGNED)
  declare corner_cut_warnings: number;
}

export default LapData;