import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import type { Post as PrismaPost } from '@prisma/client';
import type { Profile as PrismaProfile } from '@prisma/client';
import type { MemberType as PrismaMemberType } from '@prisma/client';
import type { User as PrismaUser } from '@prisma/client';

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
import DataLoader from 'dataloader';

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
        dataLoaders: {
          postsByAuthorIdLoader: new DataLoader<string, PrismaPost[]>(
            async (authorIds) => {
              if (authorIds.length === 0) {
                return authorIds.map(() => []);
              }

              const posts = await fastify.prisma.post.findMany({
                where: {
                  authorId: { in: authorIds as string[] },
                },
                orderBy: {
                  id: 'asc',
                },
              });

              const postsByAuthorId = new Map<string, PrismaPost[]>();
              posts.forEach((post) => {
                if (post.authorId) {
                  if (!postsByAuthorId.has(post.authorId)) {
                    postsByAuthorId.set(post.authorId, []);
                  }
                  postsByAuthorId.get(post.authorId)!.push(post);
                }
              });
              return authorIds.map((id) => postsByAuthorId.get(id) || []);
            },
          ),
          profileByUserIdLoader: new DataLoader<string, PrismaProfile | null>(
            async (userIds) => {
              const profiles = await fastify.prisma.profile.findMany({
                where: {
                  userId: { in: userIds as string[] },
                },
              });

              const profilesByUserId = new Map<string, PrismaProfile>();
              profiles.forEach((profile) => {
                profilesByUserId.set(profile.userId, profile);
              });

              return userIds.map((id) => profilesByUserId.get(id) || null);
            },
          ),
          memberTypeByIdLoader: new DataLoader<string, PrismaMemberType | null>(
            async (memberTypeIds) => {
              const memberTypes = await fastify.prisma.memberType.findMany({
                where: {
                  id: { in: memberTypeIds as string[] },
                },
              });

              const memberTypesById = new Map<string, PrismaMemberType>();
              memberTypes.forEach((mt) => {
                memberTypesById.set(mt.id, mt);
              });

              return memberTypeIds.map((id) => memberTypesById.get(id) || null);
            },
          ),
          userSubscribedToLoader: new DataLoader<string, PrismaUser[]>(
            async (subscriberIds: readonly string[]) => {
              console.log(
                '[DataLoader] userSubscribedToLoader batchFn called with subscriberIds:',
                subscriberIds,
              );

              const relations = await fastify.prisma.subscribersOnAuthors.findMany({
                where: {
                  subscriberId: { in: subscriberIds as string[] },
                },
                include: {
                  author: true,
                },
              });

              const authorsBySubscriberId = new Map<string, PrismaUser[]>();
              relations.forEach((relation) => {
                if (!authorsBySubscriberId.has(relation.subscriberId)) {
                  authorsBySubscriberId.set(relation.subscriberId, []);
                }

                if (relation.author) {
                  authorsBySubscriberId.get(relation.subscriberId)!.push(relation.author);
                }
              });

              return subscriberIds.map((id) => authorsBySubscriberId.get(id) || []);
            },
          ),
          subscribedToUserLoader: new DataLoader<string, PrismaUser[]>(
            async (authorIds: readonly string[]) => {
              console.log(
                '[DataLoader] subscribedToUserLoader batchFn called with authorIds:',
                authorIds,
              );

              const relations = await fastify.prisma.subscribersOnAuthors.findMany({
                where: {
                  authorId: { in: authorIds as string[] },
                },
                include: {
                  subscriber: true,
                },
              });

              const subscribersByAuthorId = new Map<string, PrismaUser[]>();
              relations.forEach((relation) => {
                if (!subscribersByAuthorId.has(relation.authorId)) {
                  subscribersByAuthorId.set(relation.authorId, []);
                }

                if (relation.subscriber) {
                  subscribersByAuthorId.get(relation.authorId)!.push(relation.subscriber);
                }
              });

              return authorIds.map((id) => subscribersByAuthorId.get(id) || []);
            },
          ),
        },
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

      return result;
    },
  });
};

export default plugin;
