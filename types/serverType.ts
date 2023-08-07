import { AccountInterface, UserInterface } from '../managementState/server/Descriptions';

export const QueryKeys = {
  user: 'user',
  account: 'account',
  post: 'post',
  message: 'message',
  profile: 'profile',
  address: 'address',
  notification: 'notification',
  favorites: 'favorites',
} as const;

export type UserDataType =  UserInterface  &  AccountInterface;
// export type QueryKeys = typeof QueryKeys[keyof typeof QueryKeys];
