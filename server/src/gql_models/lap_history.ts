import LapHistory from "../models/lap_history.model";
import { QueryTypes } from "sequelize";
import { sequelize } from "../sequelize";

export const typeDef = `
  type LapHistory {
    session_uid: String!
    index: Int!
    username: UInt!
    lap_num: Int!
    lap_time: Int
    sector1_time: Int
    sector2_time: Int
    sector3_time: Int
    lap_valid: Int
    name: String
  }

  type Query {
    getLapHistory(session_uid: String!, username: UInt!): [LapHistory]
  }
`;

export const resolvers = {
  Query: {
    getLapHistory: async (parent, args, contextValue, info) => {
      return await sequelize.query(`SELECT lh.lap_num, lh.lap_time, p.name FROM lap_history AS lh JOIN participants AS p ON (lh.session_uid = p.session_uid AND lh.username = p.username AND lh.index = p.index) WHERE lh.session_uid = "${args.session_uid}" AND lh.username = ${args.username} AND lh.lap_time > 0`, { type: QueryTypes.SELECT });
    }
  }
}