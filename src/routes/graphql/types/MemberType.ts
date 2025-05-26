import { GraphQLObjectType, GraphQLNonNull, GraphQLFloat, GraphQLInt } from 'graphql';
import { MemberTypeIdEnumType } from './MemberTypeIdEnum.js';

export const MemberType: GraphQLObjectType = new GraphQLObjectType({
  name: 'Member',
  description: 'Represent a Member with id, discount and limit of posts per month',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(MemberTypeIdEnumType),
    },
    discount: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
    postsLimitPerMonth: {
      type: new GraphQLNonNull(GraphQLInt),
    },
  }),
});
