import { GraphQLInputObjectType, GraphQLString, GraphQLFloat } from 'graphql';

export const ChangeUserInputType = new GraphQLInputObjectType({
  name: 'ChangeUserInput',
  description: 'Input payload for changing an existing User.',
  fields: () => ({
    name: {
      type: GraphQLString,
      description: "The new user's name (optional).",
    },
    balance: {
      type: GraphQLFloat,
      description: "The new user's balance (optional).",
    },
  }),
});
