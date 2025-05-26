import { GraphQLObjectType, GraphQLString, GraphQLNonNull } from 'graphql';
import { UUIDType } from './uuid.js';

export const PostType: GraphQLObjectType = new GraphQLObjectType({
  name: 'Post',
  description: 'Represent a Post with id, title and content',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(UUIDType),
    },
    title: {
      type: new GraphQLNonNull(GraphQLString),
    },
    content: {
      type: new GraphQLNonNull(GraphQLString),
    },
  }),
});
