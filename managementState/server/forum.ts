import { combine } from 'zustand/middleware';
import { create } from 'zustand';
import { SQuery } from '..';
import { ByAccountResult } from './byAccount';

export const useListAllForum = create(
  combine(
    {
      listAllForum: new Map() as Map<string, ByAccountResult>,
      pageAll: 1,
      hasMoreAll: false,
      loadingAll: false,
    },
    (set) => ({
      getList: async ({ page }: { page: number }) => {
        set({
          loadingAll: true,
        });

        //@ts-ignore
        const find = await SQuery.service('Trouve', 'recent', {
          limit: 5,
          page,
        });

        let data = find.response || ([] as ByAccountResult[]);

        set((state) => {
          const newState = new Map(state.listAllForum);
          data.forEach((item) => {
            newState.set(item._id, item);
          });

          return {
            hasMoreAll: data.length < 5 ? false : true,
            listAllForum: newState,
            pageAll: page + 1,
            loadingAll: false,
          };
        });
      },
    })
  )
);

export const useListPopularLikes = create(
  combine(
    {
      listForum: new Map() as Map<string, ByAccountResult>,
      page: 1,
      hasMore: false,
      loading: false,
    },
    (set) => ({
      getList: async ({ page }: { page: number }) => {
        set({
          loading: true,
        });
        //@ts-ignore
        const find = await SQuery.service('Trouve', 'popular', {
          limit: 5,
          page,
          index: 'like',
        });

        let data = find.response || ([] as ByAccountResult[]);
        set((state) => {
          const newState = new Map(state.listForum);
          data.forEach((item) => {
            newState.set(item._id, item);
          });

          return {
            hasMore: data.length < 5 ? false : true,
            listForum: newState,
            page: page + 1,
            loading: false,
          };
        });
      },
    })
  )
);

export const useListPopularComments = create(
  combine(
    {
      listForum: new Map() as Map<string, ByAccountResult>,
      page: 1,
      hasMore: false,
      loading: false,
    },
    (set) => ({
      getList: async ({ page }: { page: number }) => {
        set({
          loading: true,
        });

        //@ts-ignore
        const find = await SQuery.service('Trouve', 'popular', {
          limit: 5,
          page,
          index: 'comments',
        });
        let data = find.response || ([] as ByAccountResult[]);
        set((state) => {
          const newState = new Map(state.listForum);
          data.forEach((item) => {
            newState.set(item._id, item);
          });

          return {
            hasMore: data.length < 5 ? false : true,
            listForum: newState,
            page: page + 1,
            loading: false,
          };
        });
      },
    })
  )
);

export const useListPopularShared = create(
  combine(
    {
      listForum: new Map() as Map<string, ByAccountResult>,
      page: 1,
      hasMore: false,
      loading: false,
    },
    (set) => ({
      getList: async ({ page }: { page: number }) => {
        set({
          loading: true,
        });
        //@ts-ignore
        const find = await SQuery.service('Trouve', 'popular', {
          limit: 5,
          page,
          index: 'shared',
        });

        let data = find.response || ([] as ByAccountResult[]);

        set((state) => {
          const newState = new Map(state.listForum);

          data.forEach((item) => {
            newState.set(item._id, item);
          });
          return {
            hasMore: data.length < 5 ? false : true,
            listForum: newState,
            page: page + 1,
            loading: false,
          };
        });
      },
    })
  )
);
