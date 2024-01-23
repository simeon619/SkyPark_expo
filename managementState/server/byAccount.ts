import { create } from 'zustand';
import { CacheValues } from './Descriptions';
import { combine } from 'zustand/middleware';
import { SQuery } from '..';

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

const accountDBtype = {
  ...CacheValues['account'],
  profile: { ...CacheValues['profile'] },
  address: { ...CacheValues['address'] },
};
export const useListpostOtherAccount = create(
  combine(
    {
      listForum: new Map() as Map<string, ByAccountResult>,
      page: 1,
      hasMore: false,
      loading: false,
    },
    (set) => ({
      getList: async ({ page, accountId }: { page: number; accountId: string }) => {
        set({
          loading: true,
        });
        // @ts-ignore
        const find = await SQuery.service('Trouve', 'byAccount', {
          account: accountId,
          limit: 5,
          page,
        });
        let data = (find.response || []) as ByAccountResult[];
        console.log('🚀 ~ getList: ~ data:', data);
        set((state) => {
          const newState = new Map(state.listForum);
          data.forEach((item) => {
            newState.set(accountId + item._id, item);
          });

          return {
            hasMore: data.length < 5 ? false : true,
            listForum: newState,
            page: page + 1,
            loading: false,
          };
        });
      },
      clearList: () => {
        set({
          listForum: new Map(),
          page: 1,
          hasMore: false,
          loading: false,
        });
      },
    })
  )
);
export type ByAccountResult = typeof byAccountResult;

export type AccountDBtype = typeof accountDBtype;
