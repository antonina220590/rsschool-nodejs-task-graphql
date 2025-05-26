import { GraphQLSchema } from 'graphql';

import { RootQueryType } from './RootQueryType.js';
import { MutationsType } from './MutationsType.js';

import { UserType } from './types/UserType.js';
import { PostType } from './types/PostType.js';
import { ProfileType } from './types/ProfileType.js';
import { MemberType } from './types/MemberType.js';

import { MemberTypeIdEnumType } from './types/MemberTypeIdEnum.js';

import { UUIDType } from './types/uuid.js';

import { CreateUserInputType } from './inputs/CreateUserInputType.js';
import { ChangeUserInputType } from './inputs/ChangeUserInputType.js';
import { CreatePostInputType } from './inputs/CreatePostInputType.js';
import { ChangePostInputType } from './inputs/ChangePostInputType.js';
import { CreateProfileInputType } from './inputs/CreateProfileInputType.js';
import { ChangeProfileInputType } from './inputs/ChangeProfileInputType.js';

export const schema = new GraphQLSchema({
  query: RootQueryType,
  mutation: MutationsType,
  types: [
    UserType,
    PostType,
    ProfileType,
    MemberType,

    MemberTypeIdEnumType,

    UUIDType,

    CreateUserInputType,
    ChangeUserInputType,
    CreatePostInputType,
    ChangePostInputType,
    CreateProfileInputType,
    ChangeProfileInputType,
  ],
});
