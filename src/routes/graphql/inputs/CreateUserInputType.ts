import {
  GraphQLInputObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLFloat,
} from 'graphql';

export const CreateUserInputType = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  description: 'Input payload for creating a new User.',
  fields: () => ({
    name: {
      type: new GraphQLNonNull(GraphQLString),
      description: "The user's name.",
    },
    balance: {
      type: new GraphQLNonNull(GraphQLFloat),
      description: "The user's initial balance.",
    },
  }),
});
