import { create } from 'zustand';
import { SQuery } from '../..';
import { useAuthStore } from '../auth';
import {
	AccountInterface,
	ActivityInterface,
	PostInterface,
	ProfileInterface,
} from '../Descriptions';
import { ArrayData, FileType, getArrayDataInit } from '../../../lib/SQueryClient';
import { combine } from 'zustand/middleware';
import { mergeArrayData } from '../../../Utilis/functions/utlisSquery';

export type GroupeType = ActivityInterface & { poster: ProfileInterface } & {
	listAccount: AccountInterface & { profile: ProfileInterface }[];
};
type GroupSchema = {
	listGroupe: GroupeType[];
	loadingGroupe: boolean;
	getGroupe: () => void;
};
type surveySchema = {
	options: { label: string }[];
	delay: number;
};

export const useGroupActivity = create<GroupSchema, any>((set) => ({
	listGroupe: [],
	loadingGroupe: false,
	getGroupe: async () => {
		set({
			loadingGroupe: true,
		});
		const quarterId = useAuthStore.getState().quarter?._id;

		if (!quarterId) return;

		const quarter = await SQuery.newInstance('quarter', { id: quarterId });
		let activities = await quarter?.activities;
		let activitiespage = await activities?.update({
			paging: {
				page: 1,
				limit: 100,
			},
		});

		activitiespage?.itemsInstance.forEach(async (itemP) => {
			let item = await itemP;
			item?.when(
				'refresh',
				async (obj) => {
					set({
						loadingGroupe: false,
					});
					let onlyActivity = await getListGroup({
						activity: {
							added: [],
							hasNextPage: false,
							items: [obj as ActivityInterface],
							hasPrevPage: false,
							limit: 0,
							nextPage: 0,
							page: 0,
							pagingCounter: 0,
							prevPage: 0,
							removed: [],
							totalItems: 0,
							totalPages: 0,
						},
					});

					set((state) => {
						const updatedListGroupe = state.listGroupe.map((item) => {
							if (item._id === onlyActivity[0]._id) {
								return {
									...item,
									...onlyActivity[0],
									listen: Boolean(
										onlyActivity[0].listAbonne.find(
											(ab) => ab === useAuthStore.getState().account?._id
										)
									),
								};
							}
							return item;
						});
						return {
							listGroupe: updatedListGroupe,
						};
					});
				},
				item.$id
			);
		});
		// for (let i = 0; i < (activitiespage?.itemsInstance.length || 0); i++) {
		//   let item = await activitiespage?.itemsInstance[i];
		// }

		// @ts-ignore
		let Grupactivity = await getListGroup({ activity: activitiespage });
		set({
			listGroupe: Grupactivity,
			loadingGroupe: false,
		});
	},
}));

const getListGroup = async ({ activity }: { activity: ArrayData<ActivityInterface> }) => {
	let promises = activity?.items.map((item) => {
		return new Promise(async (resolve) => {
			let posterId = item.poster;
			const poster = await SQuery.newInstance('profile', { id: posterId });
			const listAccount = await SQuery.collector({
				$option: {},
				account: item.listAbonne || [],
			});

			let listProfileId = listAccount.account.map((account) => {
				return account.$cache.profile || '';
			});

			const profileCollector = await SQuery.collector({
				$option: {},
				profile: listProfileId,
			});

			let accountWithImg = listAccount.account.map((a) => {
				return {
					...a,
					profile: profileCollector.profile.find((p) => p.$id === a.$cache.profile)?.$cache!,
				};
			});

			if (!poster) return new Error('poster not found');
			resolve({
				...item,
				poster: poster?.$cache,
				listAccount: accountWithImg,
			});
		});
	});
	let Ga = (await Promise.allSettled(promises))
		.filter((s) => s.status === 'fulfilled')
		.map((s) => {
			return (s as any).value as GroupeType;
		});

	return Ga;
};

export const upDownGroup = async ({ id }: { id: string }) => {
	const activity = await SQuery.newInstance('activity', { id });

	if (!activity) throw new Error('activity not found');

	activity.listen = !activity.listen;
};

export const useListPostActivity = create(
	combine(
		{
			listPostActivity: getArrayDataInit(),
			loading: false,
			loadingPublish: false,
		},
		(set) => ({
			getList: async ({ activityId, page }: { activityId: string; page: number }) => {
				const quarter = await SQuery.newInstance('activity', { id: activityId });

				const thread = await quarter?.channel;

				thread?.when(
					'update',
					async (obj) => {
						let postId = obj.added[0];
						if (!postId) return;
						set(() => {
							return {
								loading: true,
							};
						});
						const post = await SQuery.newInstance('post', { id: postId });
						post?.when(
							'refresh',
							(newPost) => {
								let oldPost: PostInterface;
								set((state) => {
									const newState = { ...state };
									let index = newState['listPostActivity'].items.findIndex(
										(item) => item._id === post.$id
									);
									if (index !== -1) {
										oldPost = newState['listPostActivity'].items[index];
									}
									return {
										listPostActivity: mergeArrayData(
											newState['listPostActivity'],
											{ ...newState['listPostActivity'], items: [{ ...oldPost, ...newPost }] },
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
								listPostActivity: mergeArrayData(
									state['listPostActivity'],
									{ ...state['listPostActivity'], items: ArrayPos },
									true
								),
								loading: false,
							};
						});
					},
					'ThreadQuarte:update'
				);
				const posts = await thread?.update({
					paging: {
						page,
						limit: 10,
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
									let index = newState['listPostActivity'].items.findIndex(
										(i) => i._id === post.$id
									);
									if (index !== -1) {
										oldState = newState['listPostActivity'].items[index];
									}
									return {
										listPostActivity: mergeArrayData(
											newState['listPostActivity'],
											{ ...newState['listPostActivity'], items: [{ ...oldState, ...obj }] },
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
							listPostActivity: mergeArrayData(state['listPostActivity'], posts),
							loading: false,
						};
					});
				}
			},
			publishPost: async ({
				activityId,
				data,
			}: {
				activityId: string;
				data: {
					value?: string;
					accountId: string | undefined;
					files?: FileType[];
					type: string;
					theme?: string;
					surveyOptions?: surveySchema;
				};
			}) => {
				set(() => {
					return {
						loadingPublish: true,
					};
				});
				const { value, accountId, files, type, surveyOptions, theme } = data;

				if (!accountId) return;
				const quarter = await SQuery.newInstance('activity', { id: activityId });

				const thread = await quarter?.channel;

				await thread?.update({
					addNew: [
						{
							message: {
								text: value,
								files,
								account: accountId,
							},
							survey: surveyOptions,
							type,
							theme,
						},
					],
				});

				set((state) => {
					return {
						loadingPublish: false,
					};
				});
			},
		})
	)
);
