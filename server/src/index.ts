import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { GraphQLError, GraphQLScalarType, Kind } from 'graphql';
import { sequelize } from './sequelize';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge';
import {
  typeDef as User,
  resolvers as userResolvers,
} from "./gql_models/user";
import {
  typeDef as Session,
  resolvers as sessionResolvers,
} from "./gql_models/session";
import {
  typeDef as FinalClassfication,
  resolvers as finalClassificationResolvers,
} from "./gql_models/final_classification";
import {
  typeDef as Participants,
  resolvers as participantsResolvers,
} from "./gql_models/participants";
import {
  typeDef as LapHistory,
  resolvers as lapHistoryResolvers,
} from "./gql_models/lap_history";

const MIN = 0;
const MAX = Math.pow(2, 32) - 1;

(async () => {
  const typeDefs = `#graphql
    scalar Date
    scalar UInt
  `;

  // Resolvers define how to fetch the types defined in your schema.
  // This resolver retrieves books from the "books" array above.
  const resolvers = {
    Date: new GraphQLScalarType({
      name: "Date",
      description: "Custom Date scalar type",
      parseValue(value: any) {
        return new Date(value);
      },
      serialize(value: any) {
        return value.getTime();
      },
      parseLiteral(ast) {
        if (ast.kind === Kind.INT) {
          return new Date(+ast.value);
        }
        return null;
      },
    }),
    UInt: new GraphQLScalarType({
      name: "UInt",
      description: "Custom unsigned Integer scalar type",
      parseValue(value: any) {
        if (Number.isInteger(value) && value >= MIN && value <= MAX) return value;
        throw new GraphQLError('', [])
      },
      serialize(value: any) {
        if (Number.isInteger(value) && value >= MIN && value <= MAX) return value;
        return null;
      },
      parseLiteral(ast: any) {
        const value = Number(ast.value);
        if (Number.isInteger(value) && value >= MIN && value <= MAX) return value;
        throw new GraphQLError(`Invalid UInt literal.\n${ast.value} is not UInt.`, [ast])
      }
    })
  };

  // The ApolloServer constructor requires two parameters: your schema
  // definition and your set of resolvers.
  const schema = makeExecutableSchema({
    typeDefs: mergeTypeDefs([ typeDefs, User, Session, FinalClassfication, Participants, LapHistory ]),
    resolvers: mergeResolvers([ resolvers, userResolvers, sessionResolvers, finalClassificationResolvers, participantsResolvers, lapHistoryResolvers ])
  });
  const server = new ApolloServer({schema});

  sequelize.authenticate;

  // Passing an ApolloServer instance to the `startStandaloneServer` function:
  //  1. creates an Express app
  //  2. installs your ApolloServer instance as middleware
  //  3. prepares your app to handle incoming requests
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });

  console.log(`🚀  Server ready at: ${url}`);
})();