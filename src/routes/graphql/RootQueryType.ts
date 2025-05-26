// src/routes/graphql/RootQueryType.ts

import { GraphQLObjectType, GraphQLList, GraphQLNonNull } from 'graphql';
import type { GraphQLContext } from './context.js'; // Наш типизированный контекст

// Импортируем все наши типы объектов, enum'ы и кастомные скаляры
import { UserType } from './types/UserType.js';
import { PostType } from './types/PostType.js';
import { ProfileType } from './types/ProfileType.js';
import { MemberType } from './types/memberType.js';
import { MemberTypeIdEnumType } from './types/MemberTypeIdEnum.js';
import { UUIDType } from './types/uuid.js';

export const RootQueryType = new GraphQLObjectType({
  name: 'RootQueryType',
  description: 'The root query type for all read operations.',
  fields: () => ({
    memberTypes: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(MemberType))),
      description: 'Retrieves all member types.',
      resolve: async (_parent: unknown, _args: unknown, context: GraphQLContext) => {
        return context.prisma.memberType.findMany();
      },
    },
    memberType: {
      type: MemberType,
      description: 'Retrieves a single member type by its ID.',
      args: {
        id: { type: new GraphQLNonNull(MemberTypeIdEnumType) },
      },
      resolve: async (
        _parent: unknown,
        args: { id: 'BASIC' | 'BUSINESS' },
        context: GraphQLContext,
      ) => {
        return context.prisma.memberType.findUnique({
          where: { id: args.id },
        });
      },
    },

    users: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
      description: 'Retrieves all users.',
      resolve: async (_parent: unknown, _args: unknown, context: GraphQLContext) => {
        return context.prisma.user.findMany();
      },
    },
    user: {
      type: UserType,
      description: 'Retrieves a single user by their ID.',
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (
        _parent: unknown,
        args: { id: string },
        context: GraphQLContext,
      ) => {
        return context.prisma.user.findUnique({
          where: { id: args.id },
        });
      },
    },

    posts: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(PostType))),
      description: 'Retrieves all posts.',
      resolve: async (_parent: unknown, _args: unknown, context: GraphQLContext) => {
        return context.prisma.post.findMany();
      },
    },
    post: {
      type: PostType,
      description: 'Retrieves a single post by its ID.',
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (
        _parent: unknown,
        args: { id: string },
        context: GraphQLContext,
      ) => {
        return context.prisma.post.findUnique({
          where: { id: args.id },
        });
      },
    },

    profiles: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(ProfileType))),
      description: 'Retrieves all profiles.',
      resolve: async (_parent: unknown, _args: unknown, context: GraphQLContext) => {
        return context.prisma.profile.findMany();
      },
    },
    profile: {
      type: ProfileType,
      description: 'Retrieves a single profile by its ID.',
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (
        _parent: unknown,
        args: { id: string },
        context: GraphQLContext,
      ) => {
        return context.prisma.profile.findUnique({
          where: { id: args.id },
        });
      },
    },
  }),
});
