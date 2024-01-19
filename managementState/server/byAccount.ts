import { CacheValues } from './Descriptions';

const byAccountResult = {
  ...CacheValues['post'],
  message: {
    ...CacheValues['message'],
    account: {
      ...CacheValues['account'],
      profile: { ...CacheValues['profile'] },
    },
  },
};

export type ByAccountResult = typeof byAccountResult;
