import { GraphQLObjectType, GraphQLNonNull, GraphQLBoolean, GraphQLInt } from 'graphql';
import { UUIDType } from './uuid.js';
import { MemberType } from './MemberType.js';
import type { Profile as PrismaProfile } from '@prisma/client';
import type { GraphQLContext } from '../context.js';

export const ProfileType: GraphQLObjectType = new GraphQLObjectType({
  name: 'Profile',
  description: 'Represents a user profile.',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(UUIDType),
    },
    isMale: {
      type: new GraphQLNonNull(GraphQLBoolean),
    },
    yearOfBirth: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    memberType: {
      type: new GraphQLNonNull(MemberType),
      description: 'The membership type associated with this profile.',
      resolve: async (
        parentProfile: PrismaProfile,
        _args: unknown,
        context: GraphQLContext,
      ) => {
        if (!parentProfile.memberTypeId) {
          return null;
        }
        return context.dataLoaders.memberTypeByIdLoader.load(parentProfile.memberTypeId);
      },
    },
  }),
});
