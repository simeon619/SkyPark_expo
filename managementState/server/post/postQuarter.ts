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
    set(() => {
      return {
        loadindGetData: true,
      };
    });
    const quarterId = useAuthStore.getState().quarter?._id;

    if (!quarterId) return;

    const quarter = await SQuery.newInstance('quarter', { id: quarterId });

    const Thread = await quarter?.Thread;

    if (!Thread) return;

    Thread.when(
      'update',
      async (obj) => {
        let postId = obj.added[0];
        if (!postId) return;
        set(() => {
          return {
            loadindGetData: true,
          };
        });
        const post = await SQuery.newInstance('post', { id: postId });

        post?.when(
          'refresh',
          (obj) => {
            console.log('🚀 ~ file: postQuarter.ts:52 ~ obj:', obj);
            let oldState: PostInterface;
            set((state) => {
              const newState = { ...state };

              let index = newState.listPost.items.findIndex((item) => item._id === post.$id);
              if (index !== -1) {
                oldState = newState.listPost.items[index];
              }
              return {
                listPost: mergeArrayData(
                  newState.listPost,
                  { ...newState.listPost, items: [{ ...oldState, ...obj }] },
                  true
                ),
              };
            });
          },
          post.$id
        );

        if (!post) return;
        set((state) => {
          let ArrayPos = [post.$cache];
          return {
            listPost: mergeArrayData(state.listPost, { ...state.listPost, items: ArrayPos }, true),
            loadindGetData: false,
          };
        });
      },
      'ThreadQuarte:update'
    );
    const posts = await Thread?.update({
      paging: {
        page,
        limit: 3,
        sort: {
          __createdAt: -1,
        },
      },
    });
    if (!posts) return;
    await Promise.all(
      posts.items.map(async (item) => {
        const post = await SQuery.newInstance('post', { id: item._id });
        post?.when(
          'refresh',
          (obj) => {
            console.log('🚀 ~ file: postQuarter.ts:100 ~ posts.items.map ~ obj:', obj);
            let oldState: PostInterface;
            set((state) => {
              const newState = { ...state };
              let index = newState.listPost.items.findIndex((i) => i._id === post.$id);
              if (index !== -1) {
                oldState = newState.listPost.items[index];
              }
              return {
                listPost: mergeArrayData(
                  newState.listPost,
                  { ...newState.listPost, items: [{ ...oldState, ...obj }] },
                  true
                ),
              };
            });
          },
          post.$id
        );
      })
    );
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
