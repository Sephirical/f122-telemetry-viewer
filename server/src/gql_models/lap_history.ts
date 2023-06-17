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
      const laps: Array<any> = await sequelize.query(`SELECT lh.lap_num, lh.lap_time, p.name FROM lap_history AS lh JOIN participants AS p ON (lh.session_uid = p.session_uid AND lh.username = p.username AND lh.index = p.index) WHERE lh.session_uid = "${args.session_uid}" AND lh.username = ${args.username} AND lh.lap_time > 0 AND lh.lap_num > 1`, { type: QueryTypes.SELECT });
      const stints: Array<any> = await sequelize.query(`SELECT p.name, t.stint, t.tyre_endlap FROM final_classification_tyrestint AS t JOIN participants AS p ON (t.session_uid = p.session_uid AND t.username = p.username AND t.index = p.index) WHERE t.session_uid = "${args.session_uid}" AND t.username = ${args.username} AND t.tyre_endlap != 255 ORDER BY p.name ASC, t.stint ASC`, { type: QueryTypes.SELECT });
      let to_remove: Array<any> = [];
      stints.map(s => {
        if (s.tyre_endlap === 0) return;
        to_remove.push({
          name: s.name,
          lap_num: s.tyre_endlap
        },{
          name: s.name,
          lap_num: s.tyre_endlap + 1
        })
      });
      return laps.filter(l => !to_remove.find(t => t.name === l.name && t.lap_num === l.lap_num));
    }
  }
}