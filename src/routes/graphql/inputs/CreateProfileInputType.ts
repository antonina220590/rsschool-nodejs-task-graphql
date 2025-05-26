import {
  GraphQLInputObjectType,
  GraphQLBoolean,
  GraphQLInt,
  GraphQLNonNull,
} from 'graphql';
import { UUIDType } from '../types/uuid.js';
import { MemberTypeIdEnumType } from '../types/MemberTypeIdEnum.js';

export const CreateProfileInputType = new GraphQLInputObjectType({
  name: 'CreateProfileInput',
  description: 'Input payload for creating a new Profile.',
  fields: () => ({
    isMale: {
      type: new GraphQLNonNull(GraphQLBoolean),
      description: 'Is the user male.',
    },
    yearOfBirth: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'The birth year of the user.',
    },
    userId: {
      type: new GraphQLNonNull(UUIDType),
      description: 'The ID of the user for whom the profile is created.',
    },
    memberTypeId: {
      type: new GraphQLNonNull(MemberTypeIdEnumType),
      description: 'The membership type ID for this profile.',
    },
  }),
});
