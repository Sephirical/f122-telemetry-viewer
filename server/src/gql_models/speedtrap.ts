import { QueryTypes } from "sequelize";
import Participants from "../models/participants.model";
import Session from "../models/session.model";
import User from "../models/user.model";
import { sequelize } from "../sequelize";

export const typeDef = `
  type SpeedTrap {
    id: String
    session_uid: String
    index: Int
    username: UInt
    time: Date
    speed: Float
    name: String
  }

  type Query {
    fastestSpeedTraps(session_uid: String!, username: UInt!): [SpeedTrap]
  }
`;

export const resolvers = {
  Query: {
    fastestSpeedTraps: async (parent, args, contextValue, info) => {
      const speeds: Array<any> = await sequelize.query(`SELECT p.name AS name, s.speed AS speed FROM f1_telemetry.event_speedtrap AS s 
      JOIN f1_telemetry.participants AS p ON (s.session_uid = p.session_uid AND s.username = p.username AND s.index = p.index)
      WHERE s.session_uid = ${args.session_uid} AND s.username = ${args.username} 
      AND p.session_uid = ${args.session_uid} AND p.username = ${args.username} ORDER BY s.speed DESC LIMIT 10;`, { type: QueryTypes.SELECT });
      return speeds;
    }
  }
}