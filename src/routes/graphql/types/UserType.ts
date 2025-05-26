import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLFloat,
  GraphQLList,
} from 'graphql';
import type { User as PrismaUser } from '@prisma/client';
import { UUIDType } from './uuid.js';
import { GraphQLContext } from '../context.js';
import { PostType } from './PostType.js';
import { ProfileType } from './ProfileType.js';

export const UserType: GraphQLObjectType = new GraphQLObjectType({
  name: 'User',
  description: 'Represents a User, their balance, profile, posts, and subscriptions.',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(UUIDType),
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    balance: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
    profile: {
      type: ProfileType,
      resolve: async (
        parentUser: PrismaUser,
        _args: unknown,
        context: GraphQLContext,
      ) => {
        return context.dataLoaders.profileByUserIdLoader.load(parentUser.id);
      },
    },
    posts: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(PostType))),
      resolve: async (
        parentUser: PrismaUser,
        _args: unknown,
        context: GraphQLContext,
      ) => {
        return context.dataLoaders.postsByAuthorIdLoader.load(parentUser.id);
      },
    },
    userSubscribedTo: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
      resolve: async (
        parentUser: PrismaUser,
        _args: unknown,
        context: GraphQLContext,
      ) => {
        return context.dataLoaders.userSubscribedToLoader.load(parentUser.id);
      },
    },
    subscribedToUser: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
      resolve: async (
        parentUser: PrismaUser,
        _args: unknown,
        context: GraphQLContext,
      ) => {
        return context.dataLoaders.subscribedToUserLoader.load(parentUser.id);
      },
    },
  }),
});
