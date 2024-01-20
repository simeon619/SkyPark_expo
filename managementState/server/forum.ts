import { combine } from 'zustand/middleware';
import { create } from 'zustand';
import { SQuery } from '..';
import { MessagePost } from './FindThem';
import { PostInterface } from './Descriptions';

export interface ForumTypeSer {
  _id: string;
  message: MessagePost;
  theme: string;
  type: string;
  __createdAt: string;
}

// export interface ForumType {
//   post: PostInterface & {
//     message: MessagePost;
//   };
// }
export interface ForumType extends Omit<PostInterface, 'message'> {
  message: MessagePost;
}
export interface PostForumType {
  _id: string;
  comments: string[];
  like: string[];
  message: MessagePost;
  shared: string[];
  type: string;
  theme?: string; // Ajout de la propriété "theme" en option pour le deuxième objet
}

export const useListAllForum = create(
  combine(
    {
      listAllForum: new Map() as Map<string, ForumType>,
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
          withTheme: true,
        });

        let data = find.response || ([] as ForumTypeSer[]);
        let postId = data.filter((i) => !!i.theme).map((item) => item._id);

        let dataCollected = await SQuery.collector({
          $option: {},
          post: postId,
        });

        let dataFiltered = dataCollected.post.map((post) => {
          let message = data.filter((item) => item._id === post.$id)[0].message;
          return {
            ...post.$cache,
            message,
          };
        });

        set((state) => {
          const newState = new Map(state.listAllForum);
          dataFiltered.forEach((item) => {
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
      listForum: new Map() as Map<string, PostForumType>,
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

        let data = find.response || ([] as PostForumType[]);

        let dataFiltered = data.filter((i) => !!i.theme);

        set((state) => {
          const newState = new Map(state.listForum);
          dataFiltered.forEach((item) => {
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
      listForum: new Map() as Map<string, PostForumType>,
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

        let data = find.response || ([] as PostForumType[]);
        let dataFiltered = data.filter((i) => !!i.theme);

        set((state) => {
          const newState = new Map(state.listForum);
          dataFiltered.forEach((item) => {
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
      listForum: new Map() as Map<string, PostForumType>,
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

        let data = find.response || ([] as PostForumType[]);
        console.log('🚀 ~ getList: ~ data:', data);
        let dataFiltered = data.filter((i) => !!i.theme);

        set((state) => {
          const newState = new Map(state.listForum);
          dataFiltered.forEach((item) => {
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
