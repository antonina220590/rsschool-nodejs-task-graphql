import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { graphql } from 'graphql';
import { schema } from './schema.js';
import type { GraphQLContext } from './context.js';

interface GraphQLRequestBody {
  query: string;
  variables?: Record<string, unknown>;
  operationName?: string;
}

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(request, reply) {
      const { query, variables, operationName } = request.body as GraphQLRequestBody;

      const contextValue: GraphQLContext = {
        prisma: fastify.prisma,
      };
      const result = await graphql({
        schema: schema,
        source: query,
        contextValue: contextValue,
        variableValues: variables,
        operationName: operationName,
      });
      console.log('GraphQL Result:', JSON.stringify(result, null, 2));
      return result;
    },
  });
};

export default plugin;
