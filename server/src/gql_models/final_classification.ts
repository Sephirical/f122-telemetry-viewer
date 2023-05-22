import FinalClassfication from "../models/final_classification.model";
import Participants from "../models/participants.model";
import Session from "../models/session.model";
import User from "../models/user.model";
import { sequelize } from "../sequelize";
import { QueryTypes } from "sequelize";

export const typeDef = `
  type FinalClassification {
    session_uid: String!
    index: Int!
    username: UInt!
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
    Session: Session
    User: User
    Participants: [Participants]
  }

  type Query {
    finalClassifications(session_uid: String!, username: UInt!): [FinalClassification]
  }
`;

export const resolvers = {
  Query: {
    finalClassifications: async (parent, args, contextValue, info) => {
      //const classifications =
      return await FinalClassfication.findAll({
        where: {
          session_uid: args.session_uid,
          username: args.username
        },
        include: [
          {
            model: User
          },
          {
            model: Session
          },
          {
            model: Participants,
            on: {
              uid: sequelize.where(sequelize.col("FinalClassification.session_uid"), "=", sequelize.col("Participants.session_uid")),
              username: sequelize.where(sequelize.col("FinalClassification.username"), "=", sequelize.col("Participants.username")),
              index: sequelize.where(sequelize.col("FinalClassification.index"), "=", sequelize.col("Participants.index")),
            },
            attributes: ["index", "name"]
          }
        ]
      });
    }
  }
}