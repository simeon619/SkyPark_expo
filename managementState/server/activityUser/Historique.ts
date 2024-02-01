import { create } from 'zustand';
import { SQuery } from '../..';
import { PostInterface, MessageInterface, HistoriqueInterface } from '../Descriptions';
import { useAuthStore } from '../auth';
import { GroupeType } from './groupActivity';

type PostType = {
	post: PostInterface & { message: MessageInterface };
	value: string;
	id: string;
	mode: 'like' | 'create' | 'shared';
};
type Activity = {
	activity: GroupeType;
	value: string;
	id: string;
	mode: 'listen';
};
export type HistoriqueType = PostType | Activity;

type HistoriqueSchema = {
	listHistorique: HistoriqueType[];
	getHistorique: () => void;
	loadingHistorique: boolean;
};

export const useHistoriqueStore = create<HistoriqueSchema, any>((set) => ({
	listHistorique: [],
	loadingHistorique: false,
	getHistorique: async () => {
		set({
			loadingHistorique: true,
		});
		const historiqueId = useAuthStore.getState().account?.historique;
		if (!historiqueId) return;
		const historique = await SQuery.newInstance('historique', { id: historiqueId });
		if (!historique) return;

		let listCacheHistorique = (await getListHistorique(historique.$cache)) || [];
		let newData = {} as Record<string, HistoriqueType>;

		listCacheHistorique.forEach((element) => {
			if (element.mode === 'listen') {
				return (newData[element.activity._id + element.mode] = element);
			} else {
				return (newData[element.post._id + element.mode] = element);
			}
		});

		set(() => {
			return {
				listHistorique: Object.values(newData),
				loadingHistorique: false,
			};
		});

		historique.when(
			'refresh:elements',
			async (obj) => {
				if (!obj?.elements?.[0]) return;
				let cacheHistorique = await getListHistorique({ ...obj, elements: [obj.elements[0]] });
				if (!cacheHistorique) return;
				set((state) => {
					const oldState = state.listHistorique;
					oldState.forEach((element) => {
						if (element.mode === 'listen') {
							return (newData[element.activity._id + element.mode] = element);
						} else {
							return (newData[element.post._id + element.mode] = element);
						}
					});
					if (cacheHistorique[0].mode === 'listen') {
						newData[cacheHistorique[0].activity._id + cacheHistorique[0].mode] = cacheHistorique[0];
					} else {
						newData[cacheHistorique[0].post._id + cacheHistorique[0].mode] = cacheHistorique[0];
					}
					return {
						listHistorique: Object.values(newData),
						loadingHistorique: false,
					};
				});
			},
			historiqueId
		);
	},
}));

const getListHistorique = async (historique: Partial<HistoriqueInterface>) => {
	if (!historique) return;

	let promises = historique.elements?.map(async (element) => {
		return new Promise(async (resolve, reject) => {
			if (element.modelName === 'post') {
				const post = await SQuery.newInstance('post', { id: element.id });
				if (!post) return reject(null);
				return resolve({
					post: {
						...post?.$cache,
						message: (await post?.message)?.$cache,
					},
					value: element.value,
					mode: element.mode,
					//@ts-ignore
					id: element._id,
				});
			} else if (element.modelName === 'activity') {
				const activity = await SQuery.newInstance('activity', { id: element.id });
				if (!activity) return reject(null);
				return resolve({
					activity: {
						...activity?.$cache,
						poster: (await activity?.poster)?.$cache,
					},
					value: element.value,
					mode: element.mode,
					//@ts-ignore
					id: element._id,
				});
			}
			reject(null);
		});
	});

	if (!promises) return;

	let list = (await Promise.allSettled(promises))
		.filter((s) => s.status === 'fulfilled')
		.map((s) => (s as any).value as PostType | Activity);

	return list;
};
