import { combine } from 'zustand/middleware';
import { create } from 'zustand';
import { SQuery } from '..';
import { ByAccountResult } from './byAccount';

const LIMIT = 25;

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
					limit: LIMIT,
					page,
				});

				let data = find.response || ([] as ByAccountResult[]);

				set((state) => {
					const newState = new Map(state.listAllForum);
					data.forEach((item) => {
						newState.set(item._id, item);
					});
					return {
						hasMoreAll: data.length < LIMIT ? false : true,
						listAllForum: newState,
						pageAll: page + 1,
						loadingAll: false,
					};
				});
			},
		})
	)
);
export const useListResponseForum = create(
	combine(
		{
			listForum: new Map() as Map<string, { parent: ByAccountResult; post: ByAccountResult }>,
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
				const find = await SQuery.service('Trouve', 'mesReponses', {
					limit: LIMIT,
					page,
				});

				let data = find.response || ([] as { parent: ByAccountResult; post: ByAccountResult }[]);
				console.log('🚀 ~ useListResponseForum: ~ data:', data);

				set((state) => {
					const newState = new Map(state.listForum);
					data.forEach((item) => {
						//@ts-ignore
						newState.set(item.parent._id, item.parent);
					});

					return {
						hasMore: data.length < LIMIT ? false : true,
						listForum: newState,
						page: page + 1,
						loading: false,
					};
				});
			},
		})
	)
);
export const useListWaitForum = create(
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
				const find = await SQuery.service('Trouve', 'enAttente', {
					limit: LIMIT,
					page,
				});

				let data = find.response || ([] as ByAccountResult[]);
				// console.log('🚀 ~ useListWaitForum: ~ data:', data);

				set((state) => {
					const newState = new Map(state.listAllForum);
					data.forEach((item) => {
						newState.set(item._id, item);
					});

					return {
						hasMoreAll: data.length < LIMIT ? false : true,
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
					limit: LIMIT,
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
						hasMore: data.length < LIMIT ? false : true,
						listForum: newState,
						page: page + 1,
						loading: false,
					};
				});
			},
		})
	)
);

export const useListFavorites = create(
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
				const find = await SQuery.service('Trouve', 'favorites', {
					limit: LIMIT,
					page,
				});
				// console.log('🚀 ~ useListFavorites: ~ find:', find);

				let data = find.response || ([] as ByAccountResult[]);
				set((state) => {
					const newState = new Map(state.listForum);
					data.forEach((item) => {
						newState.set(item._id, item);
					});

					return {
						hasMore: data.length < LIMIT ? false : true,
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
					limit: LIMIT,
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
						hasMore: data.length < LIMIT ? false : true,
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
					limit: LIMIT,
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
						hasMore: data.length < LIMIT ? false : true,
						listForum: newState,
						page: page + 1,
						loading: false,
					};
				});
			},
		})
	)
);

export const useMyForumList = create(
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
				const find = await SQuery.service('Trouve', 'byAccount', {
					limit: LIMIT,
					page,
					withTheme: true,
				});

				let data = find.response || ([] as ByAccountResult[]);

				set((state) => {
					const newState = new Map(state.listForum);

					data.forEach((item) => {
						newState.set(item._id, item);
					});
					return {
						hasMore: data.length < LIMIT ? false : true,
						listForum: newState,
						page: page + 1,
						loading: false,
					};
				});
			},
		})
	)
);
