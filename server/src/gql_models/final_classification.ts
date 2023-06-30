import FinalClassfication from "../models/final_classification.model";
import Participants from "../models/participants.model";
import Session from "../models/session.model";
import User from "../models/user.model";
import { sequelize } from "../sequelize";
import { QueryTypes } from "sequelize";

export const typeDef = `
  type FinalClassification {
    session_uid: String
    index: Int
    name: String
    team_id: Int
    username: UInt
    position: Int
    num_laps: Int
    grid_position: Int
    points: Int
    num_pitstops: Int
    result_status: Int
    best_laptime: UInt
    total_racetime: Float
    penalties_time: Int
    num_penalties: Int
    num_tyrestints: Int
    team: String
  }

  input FinalClassificationInput {
    session_uid: String
    index: String
    name: String
    team_id: String
    username: String
    position: String
    num_laps: String
    grid_position: String
    points: String
    num_pitstops: String
    result_status: String
    best_laptime: String
    total_racetime: String
    penalties_time: String
    num_penalties: String
    num_tyrestints: String
    team: String
  }

  input CreateFinalClassificationInput {
    session_uid: String!
    username: UInt!
    classifications: [FinalClassificationInput]
  }

  type Query {
    finalClassifications(session_uid: String!, username: UInt!): [FinalClassification]
    oorFinalClassifications(session_uid: String!, username: UInt!): [FinalClassification]
  }

  type Mutation {
    createFinalClassifications(input: CreateFinalClassificationInput): Boolean
  }
`;

export const resolvers = {
  Query: {
    finalClassifications: async (parent, args, contextValue, info) => {
      const classifications: Array<any> = await sequelize.query(`SELECT p.index, p.name, p.team_id, f.position, f.num_laps, f.grid_position, f.num_pitstops, 
      f.best_laptime, f.total_racetime, f.penalties_time, f.num_penalties, f.result_status
      FROM final_classification AS f 
      JOIN participants AS p ON (f.session_uid = p.session_uid AND f.index = p.index)
      JOIN user AS u ON (f.username = u.id)
      WHERE f.session_uid=${args.session_uid} AND f.username=${args.username} AND p.session_uid=${args.session_uid} AND p.username=${args.username}
      ORDER BY f.position ASC`, { type: QueryTypes.SELECT });
      return classifications;
    },
    oorFinalClassifications: async (parent, args, contextValue, info) => {
      const classifications: Array<any> = await sequelize.query(`SELECT p.index, p.name, t.name as team, f.position, f.num_laps, f.grid_position, f.num_pitstops, f.result_status, f.best_laptime, f.total_racetime, f.penalties_time, f.num_penalties, f.num_tyrestints 
        FROM final_classification AS f 
        JOIN participants AS p ON (f.session_uid = p.session_uid AND f.index = p.index)
        JOIN team AS t ON (p.team_id = t.id)
        JOIN user AS u ON (f.username = u.id)
        WHERE f.session_uid=${args.session_uid} AND f.username=${args.username} AND p.session_uid=${args.session_uid} AND p.username=${args.username}
        ORDER BY f.position ASC`, { type: QueryTypes.SELECT });
      return classifications;
    }
  },
  Mutation: {
    createFinalClassifications: async (parent, args, contextValue, info) => {
      let insert_rows = [];
      args.input.classifications.map((c, i) => {
        insert_rows[i] = {
          ...c,
          session_uid: args.session_uid,
          username: args.session_uid
        }
      });
      const classifications = await FinalClassfication.bulkCreate(insert_rows);
      if (classifications.length > 0) {
        return true;
      } else {
        return false;
      }
    }
  }
}