import {
  PrismaClient,
  Post as PrismaPost,
  Profile as PrismaProfile,
  MemberType as PrismaMemberType,
  User as PrismaUser,
} from '@prisma/client';
import DataLoader from 'dataloader';

export type PostsByAuthorIdLoaderType = DataLoader<string, PrismaPost[]>;
export type ProfileByUserIdLoaderType = DataLoader<string, PrismaProfile | null>;
export type MemberTypeByIdLoaderType = DataLoader<string, PrismaMemberType | null>;

export type UserSubscribedToLoaderType = DataLoader<string, PrismaUser[]>;
export type SubscribedToUserLoaderType = DataLoader<string, PrismaUser[]>;

export interface GraphQLContext {
  prisma: PrismaClient;
  dataLoaders: {
    postsByAuthorIdLoader: PostsByAuthorIdLoaderType;
    profileByUserIdLoader: ProfileByUserIdLoaderType;
    memberTypeByIdLoader: MemberTypeByIdLoaderType;
    userSubscribedToLoader: UserSubscribedToLoaderType;
    subscribedToUserLoader: SubscribedToUserLoaderType;
  };
}
