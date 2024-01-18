import { create } from 'zustand';
import { SQuery } from '../..';
import { mergeArrayData } from '../../../Utilis/functions/utlisSquery';
import { ArrayData, FileType, getArrayDataInit } from '../../../lib/SQueryClient';
import { PostInterface } from '../Descriptions';
import { useAuthStore } from '../auth';

type surveySchema = {
  options: { label: string }[];
  delay: number;
};

export type TypePostSchema = 'Thread' | 'supervisorThread';
type PublishSchema = {
  value?: string;
  accountId: string | undefined;
  files?: FileType[];
  type: string;
  surveyOptions?: surveySchema;
};
type quarterPostSchema = {
  listPostNeighbors: ArrayData<PostInterface>;
  listPostSupervisor: ArrayData<PostInterface>;
  loadindGetDataSupervisor: boolean;
  loadindGetDataNeighbors: boolean;
  loadingPublish: boolean;
  publishPost: (data: PublishSchema, typePost: TypePostSchema) => void;
  getListPost: (page: number, typePost: TypePostSchema) => void;
};
export const useThreadPostStore = create<quarterPostSchema, any>((set) => ({
  listPostNeighbors: getArrayDataInit(),
  listPostSupervisor: getArrayDataInit(),
  loadindGetDataNeighbors: false,
  loadindGetDataSupervisor: false,
  loadingPublish: false,
  getListPost: async (page: number, typePost: TypePostSchema) => {
    const typeCheck = typePost === 'Thread' ? 'listPostNeighbors' : 'listPostSupervisor';
    const typeLoad = typePost === 'Thread' ? 'loadindGetDataNeighbors' : 'loadindGetDataSupervisor';
    set(() => {
      return {
        [typeLoad]: true,
      };
    });
    const quarterId = useAuthStore.getState().quarter?._id;

    if (!quarterId) return;

    const quarter = await SQuery.newInstance('quarter', { id: quarterId });

    const Thread = typePost === 'Thread' ? await quarter?.Thread : await quarter?.supervisorThread;

    if (!Thread) return;

    Thread.when(
      'update',
      async (obj) => {
        let postId = obj.added[0];
        if (!postId) return;
        set(() => {
          return {
            [typeLoad]: true,
          };
        });
        const post = await SQuery.newInstance('post', { id: postId });

        post?.when(
          'refresh',
          (newPost) => {
            let oldPost: PostInterface;
            set((state) => {
              const newState = { ...state };
              let index = newState[typeCheck].items.findIndex((item) => item._id === post.$id);
              if (index !== -1) {
                oldPost = newState[typeCheck].items[index];
              }
              return {
                [typeCheck]: mergeArrayData(
                  newState[typeCheck],
                  { ...newState[typeCheck], items: [{ ...oldPost, ...newPost }] },
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
            [typeCheck]: mergeArrayData(state[typeCheck], { ...state[typeCheck], items: ArrayPos }, true),
            [typeLoad]: false,
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
            let oldState: PostInterface;
            set((state) => {
              const newState = { ...state };
              let index = newState[typeCheck].items.findIndex((i) => i._id === post.$id);
              if (index !== -1) {
                oldState = newState[typeCheck].items[index];
              }
              return {
                [typeCheck]: mergeArrayData(
                  newState[typeCheck],
                  { ...newState[typeCheck], items: [{ ...oldState, ...obj }] },
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
          [typeCheck]: mergeArrayData(state[typeCheck], posts),
          [typeLoad]: false,
        };
      });
    }
  },
  publishPost: async (data: PublishSchema, typePost: TypePostSchema) => {
    set(() => {
      return {
        loadingPublish: true,
      };
    });
    const { value, accountId, files, type, surveyOptions } = data;

    if (!accountId) return;
    const quarterId = useAuthStore.getState().quarter?._id;

    if (!quarterId) return;

    const quarter = await SQuery.newInstance('quarter', { id: quarterId });

    const Thread = await quarter?.[typePost];

    await Thread?.update({
      addNew: [
        {
          message: {
            text: value,
            files,
            account: accountId,
          },
          survey: surveyOptions,
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
