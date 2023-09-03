import { create } from 'zustand';
import { SQuery } from '../..';
import { mergeArrayData } from '../../../Utilis/functions/utlisSquery';
import { ArrayData, ArrayDataInit, FileType } from '../../../lib/SQueryClient';
import { PostInterface } from '../Descriptions';
import { useAuthStore } from '../auth';

type quarterPostSchema = {
  listPost: ArrayData<PostInterface>;
  loadindGetData: boolean;
  loadingPublish: boolean;

  publishPost: (data: { value?: string; accountId: string | undefined; files?: FileType[]; type: string }) => void;
  getListPost: (page: number) => void;
};

export const useQuarterPostStore = create<quarterPostSchema, any>((set) => ({
  listPost: ArrayDataInit,
  loadindGetData: false,
  loadingPublish: false,
  getListPost: async (page: number) => {
    set((state) => {
      return {
        ...state,
        loadindGetData: true,
      };
    });
    const quarterId = useAuthStore.getState().quarter?._id;

    if (!quarterId) return;

    const quarter = await SQuery.newInstance('quarter', { id: quarterId });

    const Thread = await quarter?.Thread;

    const posts = await Thread?.update({
      paging: {
        page,
        limit: 3,
        sort: {
          __createdAt: -1,
        },
      },
    });

    if (posts) {
      set((state) => {
        return {
          listPost: mergeArrayData(state.listPost, posts),
          loadindGetData: false,
        };
      });
    }
  },
  publishPost: async (data) => {
    set(() => {
      return {
        loadingPublish: true,
      };
    });
    const { value, accountId, files, type } = data;

    if (!accountId) return;
    const quarterId = useAuthStore.getState().quarter?._id;

    if (!quarterId) return;

    const quarter = await SQuery.newInstance('quarter', { id: quarterId });

    const Thread = await quarter?.Thread;

    const t = await Thread?.update({
      addNew: [
        {
          message: {
            text: value,
            files,
            account: accountId,
          },
          type,
        },
      ],
    });

    Thread?.when('refresh', (obj) => {});

    t?.added[0];

    set((state) => {
      return {
        ...state,
        loadingPublish: false,
      };
    });
  },
}));

export const getInfoAccount = async (accountId: string | undefined) => {
  if (!accountId) return;
  const account = await SQuery.newInstance('account', { id: accountId });
  if (!account) return;
  const profile = await account?.profile;
  if (!profile) return;
  return {
    account: account.$cache,
    profile: profile.$cache,
  };
};

export const getMessagePost = async ({ messageId }: { messageId: string }) => {
  const message = await SQuery.newInstance('message', { id: messageId });
  if (!message) return;
  return message.$cache;
};
