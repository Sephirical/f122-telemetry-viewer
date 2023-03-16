import { Sequelize } from "sequelize-typescript";
import * as dotenv from 'dotenv';
dotenv.config();

export const sequelize = new Sequelize(
  process.env.DB_SCHEMA!,
  process.env.DB_USER!,
  process.env.DB_PASS!,
  {
    host: process.env.DB_HOST!,
    dialect: "mysql",
    dialectOptions: { 
      decimalNumbers: true, 
      supportBigNumbers: true,
      bigNumberStrings: true
    },
    port: 3306,
    logging: false,
    models: [__dirname + "/models"]
  }
);