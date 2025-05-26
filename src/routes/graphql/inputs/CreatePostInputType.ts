import { GraphQLInputObjectType, GraphQLString, GraphQLNonNull } from 'graphql';
import { UUIDType } from '../types/uuid.js';

export const CreatePostInputType = new GraphQLInputObjectType({
  name: 'CreatePostInput',
  description: 'Input payload for creating a new Post.',
  fields: () => ({
    title: {
      type: new GraphQLNonNull(GraphQLString),
      description: "The post's title.",
    },
    content: {
      type: new GraphQLNonNull(GraphQLString),
      description: "The post's content.",
    },
    authorId: {
      type: new GraphQLNonNull(UUIDType),
      description: 'The ID of the user creating the post.',
    },
  }),
});
