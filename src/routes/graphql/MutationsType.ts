import { GraphQLObjectType, GraphQLNonNull, GraphQLString } from 'graphql';
import type { GraphQLContext } from './context.js';

import { UserType } from './types/UserType.js';
import { PostType } from './types/PostType.js';
import { ProfileType } from './types/ProfileType.js';
import { CreateUserInputType } from './inputs/CreateUserInputType.js';
import { CreateProfileInputType } from './inputs/CreateProfileInputType.js';
import { CreatePostInputType } from './inputs/CreatePostInputType.js';
import { ChangeUserInputType } from './inputs/ChangeUserInputType.js';
import { ChangePostInputType } from './inputs/ChangePostInputType.js';
import { ChangeProfileInputType } from './inputs/ChangeProfileInputType.js';

import { UUIDType } from './types/uuid.js';

export const MutationsType = new GraphQLObjectType({
  name: 'Mutations',
  description: 'The root mutation type for all write operations.',
  fields: () => ({
    createUser: {
      type: new GraphQLNonNull(UserType),
      args: {
        dto: { type: new GraphQLNonNull(CreateUserInputType) },
      },
      resolve: async (
        _parent: unknown,
        args: { dto: { name: string; balance: number } },
        context: GraphQLContext,
      ) => {
        return context.prisma.user.create({ data: args.dto });
      },
    },
    createProfile: {
      type: new GraphQLNonNull(ProfileType),
      args: {
        dto: { type: new GraphQLNonNull(CreateProfileInputType) },
      },
      resolve: async (
        _parent: unknown,
        args: {
          dto: {
            userId: string;
            isMale: boolean;
            yearOfBirth: number;
            memberTypeId: 'BASIC' | 'BUSINESS';
          };
        },
        context: GraphQLContext,
      ) => {
        return context.prisma.profile.create({ data: args.dto });
      },
    },
    createPost: {
      type: new GraphQLNonNull(PostType),
      args: {
        dto: { type: new GraphQLNonNull(CreatePostInputType) },
      },
      resolve: async (
        _parent: unknown,
        args: { dto: { title: string; content: string; authorId: string } },
        context: GraphQLContext,
      ) => {
        return context.prisma.post.create({ data: args.dto });
      },
    },

    changeUser: {
      type: new GraphQLNonNull(UserType),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangeUserInputType) },
      },
      resolve: async (
        _parent: unknown,
        args: { id: string; dto: { name?: string; balance?: number } },
        context: GraphQLContext,
      ) => {
        return context.prisma.user.update({
          where: { id: args.id },
          data: args.dto,
        });
      },
    },
    changePost: {
      type: new GraphQLNonNull(PostType),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangePostInputType) },
      },
      resolve: async (
        _parent: unknown,
        args: { id: string; dto: { title?: string; content?: string } },
        context: GraphQLContext,
      ) => {
        return context.prisma.post.update({
          where: { id: args.id },
          data: args.dto,
        });
      },
    },
    changeProfile: {
      type: new GraphQLNonNull(ProfileType),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangeProfileInputType) },
      },
      resolve: async (
        _parent: unknown,
        args: {
          id: string;
          dto: {
            isMale?: boolean;
            yearOfBirth?: number;
            memberTypeId?: 'BASIC' | 'BUSINESS';
          };
        },
        context: GraphQLContext,
      ) => {
        return context.prisma.profile.update({
          where: { id: args.id },
          data: args.dto,
        });
      },
    },

    deleteUser: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (
        _parent: unknown,
        args: { id: string },
        context: GraphQLContext,
      ) => {
        await context.prisma.user.delete({ where: { id: args.id } });
        return `User ${args.id} deleted successfully.`;
      },
    },
    deletePost: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (
        _parent: unknown,
        args: { id: string },
        context: GraphQLContext,
      ) => {
        await context.prisma.post.delete({ where: { id: args.id } });
        return `Post ${args.id} deleted successfully.`;
      },
    },
    deleteProfile: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (
        _parent: unknown,
        args: { id: string },
        context: GraphQLContext,
      ) => {
        await context.prisma.profile.delete({ where: { id: args.id } });
        return `Profile ${args.id} deleted successfully.`;
      },
    },

    subscribeTo: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (
        _parent: unknown,
        args: { userId: string; authorId: string },
        context: GraphQLContext,
      ) => {
        await context.prisma.subscribersOnAuthors.create({
          data: {
            subscriberId: args.userId,
            authorId: args.authorId,
          },
        });
        return `User ${args.userId} subscribed to ${args.authorId}.`;
      },
    },
    unsubscribeFrom: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (
        _parent: unknown,
        args: { userId: string; authorId: string },
        context: GraphQLContext,
      ) => {
        await context.prisma.subscribersOnAuthors.delete({
          where: {
            subscriberId_authorId: {
              subscriberId: args.userId,
              authorId: args.authorId,
            },
          },
        });
        return `User ${args.userId} unsubscribed from ${args.authorId}.`;
      },
    },
  }),
});
