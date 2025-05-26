import { GraphQLInputObjectType, GraphQLBoolean, GraphQLInt } from 'graphql';
import { MemberTypeIdEnumType } from '../types/MemberTypeIdEnum.js';

export const ChangeProfileInputType = new GraphQLInputObjectType({
  name: 'ChangeProfileInput',
  description: 'Input payload for changing an existing Profile.',
  fields: () => ({
    isMale: {
      type: GraphQLBoolean,
      description: 'The new gender (optional).',
    },
    yearOfBirth: {
      type: GraphQLInt,
      description: 'The new birth year (optional).',
    },
    memberTypeId: {
      type: MemberTypeIdEnumType,
      description: 'The new membership type ID (optional).',
    },
  }),
});
