import LapHistory from "../models/lap_history.model";
import { QueryTypes } from "sequelize";
import { sequelize } from "../sequelize";
import OORDriver from "../models/oor_driver.model";
import Participants from "../models/participants.model";
import OORDriverAlias from "../models/oor_driver_alias.model";

export const typeDef = `
  type OORDriver {
    id: UInt!
    name: String
  }

  type OORDriverAlias {
    driver_id: UInt!
    alias: String
  }

  type Query {
    getOORDrivers: [OORDriver]
  }

  type Mutation {
    setDriverNames(session_uid: String!, username: UInt!): Int
    createDriver(name: String!): Boolean
    setAlias(session_uid: String!, username: UInt!, index: Int!, driver_id: UInt!): Int
  }
`;

export const resolvers = {
  Query: {
    getOORDrivers: async (parent, args, contextValue, info) => {
      return await OORDriver.findAll();
    }
  },
  Mutation: {
    setDriverNames: async (parent, args, contextValue, info) => {
      const participants = await Participants.findAll({
        where: {
          username: args.username,
          session_uid: args.session_uid
        },
      });
      let regex = new RegExp(/[^\x20-\x7E]/, 'g');
      let participantData = participants.map(p => {
        return {
          username: p.username,
          session_uid: p.session_uid,
          name: p.name.replace(regex, ' '),
          index: p.index
        }
      });
      await Participants.bulkCreate(participantData, {
        updateOnDuplicate: ["name"]
      });
      const aliases = await OORDriverAlias.findAll({
        include: [
          {
            model: OORDriver,
            required: false,
          }
        ]
      });
      let numUpdated = 0;
      participantData.map(async (p, j) => {
        const alias = aliases.find(a => a.alias === p.name);
        if (alias) {
          numUpdated++;
          await Participants.update({
            name: alias.driver.name
          }, {
            where: {
              username: p.username,
              session_uid: p.session_uid,
              index: p.index
            }
          })
        }
      })
      return numUpdated;
    },
    createDriver: async (parent, args, contextValue, info) => {
      const existing = await OORDriver.findOne({
        where: {
          name: args.name
        }
      });
      if (!existing) {
        await OORDriver.create({
          name: args.name
        });
        return true;
      }
      return false;
    },
    setAlias: async (parent, args, contextValue, info) => {
      const [participant, driver] = await Promise.all([
        Participants.findOne({
          where: {
            session_uid: args.session_uid,
            username: args.username,
            index: args.index,
          }
        }),
        OORDriver.findByPk(args.driver_id)
      ]);

      if (participant.show_name) {
        await OORDriverAlias.create({
          driver_id: args.driver_id,
          alias: participant.name
        });
      }

      await Participants.update({
        name: driver.name,
      }, {
        where: {
          session_uid: args.session_uid,
          username: args.username,
          index: args.index,
        }
      });
      return 1;
    }
  }
}