import { QueryTypes } from "sequelize";
import { sequelize } from "../sequelize";

export const typeDef = `
  type TyreStint {
    session_uid: String!
    index: Int!
    username: UInt!
    visual: Int
    actual: Int
    stint: Int
    lap_time: Int
    tyre_endlap: Int
    name: String
    stint_length: Int
  }

  type Query {
    getTyreStints(session_uid: String!, username: UInt!): [TyreStint]
  }
`;

export const resolvers = {
  Query: {
    getTyreStints: async (parent, args, contextValue, info) => {
      const stints: Array<any> = await sequelize.query(`SELECT p.name, t.stint, t.tyre_endlap, t.tyre_visual AS "visual", f.num_laps FROM final_classification_tyrestint 
        AS t JOIN participants AS p ON (t.session_uid = p.session_uid AND t.username = p.username AND t.index = p.index) JOIN final_classification AS f ON (t.session_uid = 
        f.session_uid AND t.username = f.username AND t.index = f.index) WHERE t.session_uid = "${args.session_uid}" AND t.username = ${args.username} ORDER BY p.name ASC, 
        t.stint ASC`, { type: QueryTypes.SELECT });
      let stintInfo = [];
      stints.map(s => {
        if (s.stint === 0) {
          stintInfo.push({
            name: s.name,
            stint: s.stint,
            visual: s.visual,
            ...(s.tyre_endlap === 255) ? { stint_length: s.num_laps } : { stint_length: s.tyre_endlap + 1 }
          });
        } else {
          const lastStint = stints.find(st => st.name === s.name && st.stint === s.stint - 1);
          stintInfo.push({
            name: s.name,
            stint: s.stint,
            visual: s.visual,
            ...(s.tyre_endlap === 255) ? { stint_length: s.num_laps - lastStint.tyre_endlap - 1} : { stint_length: s.tyre_endlap - lastStint.tyre_endlap }
          })
        }
      });
      return stintInfo;
    }
  }
}