import { create } from 'zustand';
import { combine } from 'zustand/middleware';
import { SQuery } from '..';
import { UrlData } from '../../lib/SQueryClient';
import { ProfileInterface, CacheValues } from './Descriptions';
import { AccountDBtype, ByAccountResult } from './byAccount';
export type UserProfile = {
	_id: string;
	email: string;
	name: string;
	profile: {
		_id: string;
		banner: UrlData[];
		imgProfile: UrlData[];
	};
	status: string;
	telephone: string;
	userTarg: string;
};
export interface MessagePost {
	_id: string;
	__createdAt: number;
	account: {
		_id: string;
		email: string;
		name: string;
		profile: {
			_id: string;
			banner: string[];
			imgProfile: string[];
		};
		status: string;
		telephone: string;
		userTarg: string;
	};
	targets: any[]; // Le type exact dépendrait du contenu réel de votre "targets"
	text: string;
}
export type Post = {
	_id: string;
	type: string;
	message: MessagePost;
};

export type ActivityPost = {
	_id: string;
	name: string;
	poster: ProfileInterface;
};
const useFindThem = create(
	combine(
		{
			listActivity: [] as ActivityPost[],
			listAccount: [] as AccountDBtype[],
			listForum: [] as ByAccountResult[],
			listPost: [] as Post[],
		},
		(set) => ({
			getList: async ({ value }: { value: string }) => {
				//@ts-ignore
				const find = await SQuery.service('Trouve', 'les', {
					limit: 5,
					page: 1,
					value,
					// "index" :  "account" | "post" | "activity"
				});

				set({
					//@ts-ignore

					listActivity: find.response?.activity || [],
					//@ts-ignore

					listAccount: find.response?.accounts || [],
					//@ts-ignore

					listForum: find.response?.postsTiltle || [],
					//@ts-ignore

					listPost: find.response?.postsText || [],
				});
			},
		})
	)
);

export const useFindAccountByTag = create(
	combine(
		{
			account: null as AccountDBtype | null,
		},
		(set) => ({
			getAccount: async ({ userTag }: { userTag: string }) => {
				//@ts-ignore
				const find = await SQuery.service('Trouve', 'accountByTag', {
					userTag: userTag,
				});
				let account = find.response || (null as AccountDBtype | null);
				// set({
				// 	//@ts-ignore
				// 	account: find.response,
				// });
				return account;
			},
		})
	)
);

export default useFindThem;
