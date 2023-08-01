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
    name: String
    User: User
    Participants: [Participants]
    session_type: Int
    is_oor: Boolean
  }

  type Query {
    sessions(username: UInt!): [Session]
  }

  type Mutation {
    updateName(uid: String!, username: UInt!, name: String): Int
    toggleOOR(uid: String!, username: UInt!, value: Boolean!): Int
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
        ],
        order: [["created_at", "ASC"]]
      });
    }
  },
  Mutation: {
    updateName: async (parent, args, contextValue, info) => {
      const [updated] = await Session.update({
        name: args.name
      }, {
        where: {
          uid: args.uid,
          username: args.username
        }
      });
      return updated;
    },
    toggleOOR: async (parent, args, contextValue, info) => {
      const [updated] = await Session.update({
        is_oor: args.value
      }, {
        where: {
          uid: args.uid,
          username: args.username
        }
      });
      return updated;
    }
  }
}