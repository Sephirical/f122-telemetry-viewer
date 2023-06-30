import User from "../models/user.model";

export const typeDef = `
  type User {
    id: UInt!
    username: String
  }

  type Query {
    users: [User]
    findUser: User
  }
`;

export const resolvers = {
  Query: {
    users: async (parent, args, contextValue, info) => {
      return await User.findAll();
    },
    findUser: async (parent, args, contextValue, info) => {
      if (!contextValue.user) {
        return null;
      } else {
        const user = await User.findOne({
          where: {
            username: contextValue.user.username
          }
        });
        return user;
      }
    }
  }
}