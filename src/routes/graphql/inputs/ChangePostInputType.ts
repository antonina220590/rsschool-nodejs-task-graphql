import { GraphQLInputObjectType, GraphQLString } from 'graphql';

export const ChangePostInputType = new GraphQLInputObjectType({
  name: 'ChangePostInput',
  description: 'Input payload for changing an existing Post.',
  fields: () => ({
    title: {
      type: GraphQLString,
      description: "The new post's title (optional).",
    },
    content: {
      type: GraphQLString,
      description: "The new post's content (optional).",
    },
  }),
});
