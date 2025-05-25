import { GraphQLEnumType } from 'graphql';

export const MemberTypeId = new GraphQLEnumType({
  name: 'MemberTypeId',
  description: 'Identifier for the type of membership (Basic or Business).',
  values: {
    BASIC: {
      value: 'BASIC',
      description: 'Basic membership type.',
    },
    BUSINESS: {
      value: 'BUSINESS',
      description: 'Business membership type.',
    },
  },
});
