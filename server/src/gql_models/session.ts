import Participants from "../models/participants.model";
import Session from "../models/session.model";
import User from "../models/user.model";
import { sequelize } from "../sequelize";
import { QueryTypes } from "sequelize";

export const typeDef = `
  type Session {
    uid: String!
    username: UInt!
    created_at: Date
    playercar_index: Int
    track_id: Int
    formula: Int
    network_game: Boolean
    season_link: UInt
    weekend_link: UInt
    session_link: UInt
    gamemode: Int
    ruleset: Int
    User: User
    Participants: [Participants]
  }

  type Query {
    sessions(username: UInt!): [Session]
  }
`;

export const resolvers = {
  Query: {
    sessions: async (parent, args, contextValue, info) => {
      return await Session.findAll({
        where: {
          username: args.username
        },
        include: [
          {
            model: User
          },
          {
            model: Participants,
            on: {
              uid: sequelize.where(sequelize.col("Session.uid"), "=", sequelize.col("Participants.session_uid")),
              username: sequelize.where(sequelize.col("Session.username"), "=", sequelize.col("Participants.username")),
            },
            attributes: ["index", "name"]
          }
        ]
      });
    }
  }
}