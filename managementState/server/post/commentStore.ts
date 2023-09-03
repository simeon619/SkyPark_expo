import { create } from 'zustand';
import { SQuery } from '../..';
import { FileType } from '../../../lib/SQueryClient';
import { PostInterface } from '../Descriptions';
import { ArrayData, ArrayDataInit } from './../../../lib/SQueryClient';

export async function setCommentPost(data: {
  postId: string;
  accountId: string;
  type: string;
  files?: FileType[];
  value?: string;
}) {
  const post = await SQuery.newInstance('post', { id: data.postId });

  if (!post) return;

  post.when('refresh', (obj) => {});

  const res = await SQuery.service('post', 'statPost', {
    postId: data.postId,
    newPostData: {
      message: {
        text: data.value,
        files: data.files,
        account: data.accountId,
      },
      type: data.type,
    },
  });

  if (!res?.response) return;

  res.response.newComment;

  const postStat = res.response.post.statPost;

  postStat.totalCommentsCount;

  return res.response;
}

type CommentPostSchema = {
  // commentList: ArrayData<PostInterface>;
  loadingComment: boolean;
  getComments: (postId: string, page?: number) => Promise<ArrayData<PostInterface>>;
  setComment: (data: {
    postId: string;
    accountId: string | undefined;
    type: string;
    files?: FileType[];
    value?: string;
  }) => Promise<
    | {
        likes: number;
        comments: number;
        shares: number;
        commentsCount: number;
        totalCommentsCount: number;
        isLiked: boolean;
      }
    | undefined
  >;
};

export const useCommentPostStore = create<CommentPostSchema, any>((set) => ({
  // commentList: ArrayDataInit,

  loadingComment: false,

  getComments: async (postId: string, page: number | undefined) => {
    set(() => ({
      loadingComment: true,
    }));
    const post = await SQuery.newInstance('post', { id: postId });
    // if (!post) return;
    const comments = await post?.comments;

    let ArrayComment = await comments?.update({
      paging: {
        page: page || 1,
        limit: 10,
        sort: {
          __createdAt: -1,
        },
      },
    });

    set(() => ({
      loadingComment: false,
    }));
    return !!ArrayComment ? ArrayComment : ArrayDataInit;

    // if (ArrayComment) {
    //   set((state) => ({
    //     //@ts-ignore
    //     commentList: mergeArrayData(state.commentList, ArrayComment),
    //     loadingComment: false,
    //   }));
    // }
  },

  setComment: async (data) => {
    if (!data.accountId) return;

    const post = await SQuery.newInstance('post', { id: data.postId });
    const comments = await post?.comments;

    if (!post || !comments) return;

    comments.when('update', async (obj) => {
      let commentId = obj?.added[0];
      if (!commentId) return;

      const comment = await SQuery.newInstance('post', { id: commentId });

      if (!comment) return;

      let commentCache = comment.$cache;

      // set((state) => ({
      //   commentList: { ...state.commentList, items: [commentCache, ...state.commentList.items] },
      // }));
    });

    const res = await SQuery.service('post', 'statPost', {
      postId: data.postId,
      newPostData: {
        message: {
          text: data.value,
          files: data.files,
          account: data.accountId,
        },
        type: data.type,
      },
    });

    return res.response?.post.statPost;
  },
}));
