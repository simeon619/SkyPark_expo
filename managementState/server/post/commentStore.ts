import { create } from 'zustand';
import { SQuery } from '../..';
import { mergeArrayData } from '../../../Utilis/functions/utlisSquery';
import { FileType } from '../../../lib/SQueryClient';
import { PostInterface } from '../Descriptions';
import { ArrayData, getArrayDataInit } from './../../../lib/SQueryClient';

// export async function setCommentPost(data: {
//   postId: string;
//   accountId: string;
//   type: string;
//   files?: FileType[];
//   value?: string;
// }) {
//   const post = await SQuery.newInstance('post', { id: data.postId });
//   if (!post) return;
//   const res = await SQuery.service('post', 'statPost', {
//     postId: data.postId,
//     newPostData: {
//       message: {
//         text: data.value,
//         files: data.files,
//         account: data.accountId,
//       },
//       type: data.type,
//     },
//   });

//   if (!res?.response) return;

//   res.response.newComment;

//   const postStat = res.response.post.statPost;

//   postStat.totalCommentsCount;

//   return res.response;
// }

type surveySchema = {
	options: { label: string }[];
	delay: number;
};

type CommentPostSchema = {
	commentList: Record<string, ArrayData<PostInterface>>;
	loadingComment: boolean;
	initComment: () => void;
	getComments: (postId: string, page?: number) => Promise<void>;
	setComment: (data: {
		postId: string;
		accountId: string | undefined;
		type: string;
		files?: FileType[];
		value?: string;
		surveyOptions?: surveySchema;
	}) => Promise<
		| {
				newCommentId: string;
				likes: number;
				comments: number;
				shares: number;
				totalCommentsCount: number;
				isLiked: boolean;
		  }
		| undefined
	>;
};

export const useCommentPostStore = create<CommentPostSchema, any>((set) => ({
	commentList: {},
	loadingComment: false,
	getComments: async (postId: string, page: number | undefined) => {
		set(() => ({
			loadingComment: true,
		}));

		// SQuery.newInstance("account" , {})

		const post = await SQuery.newInstance('post', { id: postId });
		// if (!post) return;
		const comments = await post?.comments;

		comments?.when(
			'update',
			async (obj) => {
				let commentId = obj.added[0];
				if (!commentId) return;
				const post = await SQuery.newInstance('post', { id: commentId });
				if (!post) return;
				post.when(
					'refresh',
					(obj) => {
						let oldState: PostInterface;
						set((state) => {
							const newState = { ...state };
							if (!newState.commentList) {
								newState.commentList = { [postId]: { ...getArrayDataInit(), items: [] } };
							}
							let index = newState.commentList[postId].items.findIndex(
								(item) => item._id === commentId
							);
							if (index !== -1) {
								oldState = newState.commentList[postId].items[index];
							}
							return {
								commentList: {
									[postId]: mergeArrayData(
										newState.commentList[postId],
										{ ...newState.commentList[postId], items: [{ ...oldState, ...obj }] },
										true
									),
								},
							};
						});
					},
					commentId
				);
				set((state) => {
					let ArrayPos = [post.$cache];
					const newState = { ...state };
					if (!newState.commentList) {
						newState.commentList = { [postId]: { ...getArrayDataInit(), items: [] } };
					}
					return {
						commentList: {
							[postId]: mergeArrayData(
								newState.commentList[postId],
								{ ...newState.commentList[postId], items: ArrayPos },
								true
							),
						},
						loadingComment: false,
					};
				});
			},
			'listPost:update' + postId
		);

		let ArrayComment = await comments?.update({
			paging: {
				page: page || 1,
				limit: 10,
				sort: {
					__createdAt: -1,
				},
			},
		});
		if (!ArrayComment) return;

		await Promise.all(
			ArrayComment.items.map(async (item) => {
				const commentInstance = await SQuery.newInstance('post', { id: item._id });
				commentInstance?.when(
					'refresh',
					(obj) => {
						let oldState: PostInterface;
						set((state) => {
							const newState = { ...state };
							if (!newState.commentList) {
								newState.commentList = { [postId]: { ...getArrayDataInit(), items: [] } };
							}
							let index = newState?.commentList[postId].items.findIndex(
								(item) => item._id === commentInstance.$id
							);
							if (index !== -1) {
								oldState = newState.commentList[postId].items[index];
							}
							return {
								commentList: {
									[postId]: mergeArrayData(
										newState.commentList[postId],
										{ ...newState.commentList[postId], items: [{ ...oldState, ...obj }] },
										true
									),
								},
							};
						});
					},
					commentInstance.$id
				);
			})
		);
		if (ArrayComment) {
			set((state) => {
				const newState = { ...state };
				if (!newState.commentList) {
					newState.commentList = { [postId]: { ...getArrayDataInit(), items: [] } };
				}
				return {
					//@ts-ignore
					commentList: { [postId]: mergeArrayData(newState.commentList[postId], ArrayComment) },
					loadingComment: false,
				};
			});
		}
	},
	initComment: () => {
		set({
			commentList: {},
			loadingComment: false,
		});
	},

	setComment: async (data) => {
		const { value, accountId, files, type, postId, surveyOptions } = data;

		if (!accountId) return;
		const post = await SQuery.newInstance('post', { id: data.postId });
		const comments = await post?.comments;

		if (!post || !comments) return;
		const res = await SQuery.service('post', 'statPost', {
			postId: postId,
			newPostData: {
				message: {
					//@ts-ignore
					text: value,
					//@ts-ignore
					files: files,
					account: accountId,
				},
				type: type,
				//@ts-ignore
				survey: surveyOptions,
			},
		});

		return res.response;
	},
}));
