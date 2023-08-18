import { ArrayData, ArrayDataInit, FileType } from '../../../lib/SQueryClient';
import { AccountInterface, PostInterface } from '../Descriptions';
import { create } from 'zustand';
import { SQuery } from '../..';
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
    const userId = useAuthStore.getState().user?._id;

    if (!userId) return;

    const user = await SQuery.newInstance('user', { id: userId });

    let quarter = await user?.extractor<'quarter'>('../../../');

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
    set((state) => {
      return {
        ...state,
        //@ts-ignore
        listPost: mergePostData(state.listPost, posts),
        loadindGetData: false,
      };
    });
  },
  publishPost: async (data) => {
    set((state) => {
      return {
        ...state,
        loadingPublish: true,
      };
    });
    const { value, accountId, files, type } = data;

    if (!accountId) return;
    const userId = useAuthStore.getState().user?._id;

    if (!userId) return;

    const user = await SQuery.newInstance('user', { id: userId });

    let quarter = await user?.extractor<'quarter'>('../../../');

    const Thread = await quarter?.Thread;

    Thread?.update({
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

    set((state) => {
      return {
        ...state,
        loadingPublish: false,
      };
    });
  },
}));

// type accountPostSchema = {

//   getInfoAccount: () => AccountInterface;
// }

export const getInfoAccount = async (accountId: string | undefined) => {
  if (!accountId) return;
  const account = await SQuery.newInstance('account', { id: accountId });
  console.log('🚀 ~ file: postQuarter.ts:115 ~ getInfoAccount ~ accountId:', accountId);

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
  console.log('🚀 ~ file: postQuarter.ts:115 ~ getInfoAccount ~ messageId:', messageId);

  if (!message) return;

  return message.$cache;
};

function mergePostData(existingData: ArrayData<PostInterface>, newData: ArrayData<PostInterface>) {
  console.log({ existingData, newData });
  const uniqueIds = new Set(existingData?.items.map((item) => item._id));

  newData?.items?.forEach((newItem) => {
    if (!uniqueIds.has(newItem._id)) {
      uniqueIds.add(newItem._id);
      existingData?.items.push(newItem);
    }
  });

  return {
    items: existingData?.items || [],
    hasNextPage: newData?.hasNextPage || false,
    totalItems: newData?.totalItems || 0,
    totalPages: newData?.totalPages || 0,
    pagingCounter: newData?.pagingCounter || 0,
    nextPage: newData?.nextPage || 0,
    page: newData?.page || 0,
    limit: newData?.limit || 0,
    added: newData?.added || [],
    removed: newData?.removed || [],
    hasPrevPage: newData?.hasPrevPage || false,
    prevPage: newData?.prevPage || 0,
  };
}
