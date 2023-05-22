import User from "../models/user.model";

export const typeDef = `
  type User {
    id: UInt!
    username: String
  }

  type Query {
    users: [User]
  }
`;

export const resolvers = {
  Query: {
    users: async () => {
      return await User.findAll();
    }
  }
}