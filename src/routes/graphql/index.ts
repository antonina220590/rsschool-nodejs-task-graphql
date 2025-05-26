import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import {
  parse,
  validate,
  execute,
  specifiedRules,
  GraphQLError,
  type DocumentNode,
} from 'graphql';
import { schema } from './schema.js';
import type { GraphQLContext } from './context.js';
import depthLimit from 'graphql-depth-limit';

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
      const {
        query: source,
        variables,
        operationName,
      } = request.body as GraphQLRequestBody;

      const contextValue: GraphQLContext = {
        prisma: fastify.prisma,
      };

      let documentAST: DocumentNode;
      try {
        documentAST = parse(source);
      } catch (syntaxError) {
        if (syntaxError instanceof GraphQLError) {
          return { errors: [syntaxError] };
        }
        console.error('Syntax Parse Error:', syntaxError);
        return {
          errors: [
            new GraphQLError('Syntax error.', {
              extensions: { code: 'GRAPHQL_PARSE_FAILED' },
            }),
          ],
        };
      }

      const validationRules = [...specifiedRules, depthLimit(5)];
      const validationErrors = validate(schema, documentAST, validationRules);

      if (validationErrors.length > 0) {
        return { errors: validationErrors };
      }

      const result = await execute({
        schema: schema,
        document: documentAST,
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
