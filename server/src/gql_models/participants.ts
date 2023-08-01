import Participants from "../models/participants.model";
import Session from "../models/session.model";
import User from "../models/user.model";

export const typeDef = `
  type Participants {
    session_uid: String!
    index: Int!
    username: UInt!
    is_ai: Boolean
    driver_id: Int
    network_id: Int
    team_id: Int
    is_my_team: Boolean
    race_number: Int
    nationality: Int
    name: String
    telemetry: Boolean
    show_name: Boolean
    Session: Session
    User: User
  }

  type Query {
    participants(session_uid: String!, username: UInt!): [Participants]
  }

  type Mutation {
    updateName(uid: String!, username: UInt!, index: Int!, name: String): Int
  }
`;

export const resolvers = {
  Query: {
    participants: async (parent, args, contextValue, info) => {
      return await Participants.findAll({
        where: {
          username: args.username,
          session_uid: args.session_uid
        },
      });
    }
  },
  Mutation: {
    updateName: async (parent, args, contextValue, info) => {
      const [updated] = await Participants.update({
        name: args.name
      }, {
        where: {
          session_uid: args.uid,
          username: args.username,
          index: args.index,
        }
      });
      return updated;
    }
  }
}