import { create } from 'zustand';
import { combine } from 'zustand/middleware';
import { useAuthStore } from '../auth';
import { SQuery } from '../..';
import { NotificationInterface } from '../Descriptions';
import { UrlData } from '../../../lib/SQueryClient';
import { NotificationType } from '../../../types/PostType';
import { showToast, showToastInfo } from '../../../Utilis/functions/utlisSquery';

export const useListNotification = create(
	combine(
		{
			listNotification: [] as NotificationType[],
		},
		(set) => ({
			getList: async () => {
				const notificationId = useAuthStore.getState().account?.notification;

				if (!notificationId) return;

				const notification = await SQuery.newInstance('notification', {
					id: notificationId,
				});

				if (!notification) return;

				let listNotif = (await getListNotification(notification?.$cache)) || [];

				let newData = {} as Record<string, NotificationType>;
				listNotif.forEach((notif) => {
					return (newData[notif.accountPost._id + notif.action + notif.user.name] = notif);
				});

				set({
					listNotification: Object.values(newData),
				});

				notification?.when(
					'refresh:elements',
					async (obj) => {
						let notif = (await getListNotification(obj)) || [];
						if (notif[0].action && notif[0].action !== undefined) {
							console.log('🚀 ~ notif[0].action :', notif[0].action);
							showToastInfo(notif[0].user.name + ' ' + trToFR(notif[0].action));
						}
						set((state) => {
							const oldState = state.listNotification;
							oldState.forEach((notif) => {
								return (newData[notif.accountPost._id + notif.action + notif.user.name] = notif);
							});
							newData[notif[0].accountPost._id + notif[0].action + notif[0].user.name] = notif[0];
							return {
								listNotification: Object.values(newData),
							};
						});
					},
					notification.$id
				);
			},
		})
	)
);

const getListNotification = async (historique: Partial<NotificationInterface>) => {
	if (!historique) return;

	let promises = historique.elements?.map(async (element) => {
		return new Promise(async (resolve) => {
			const account = await SQuery.newInstance('account', { id: element.triggerAccountId });
			const post = await SQuery.newInstance('post', { id: element.targetPostId });

			const message = await post?.message;
			const account2 = await message?.account;
			const profilePost = await account2?.profile;
			const messagePost = (await post?.message)?.$cache;
			const accountPost = (await message?.account)?.$cache;
			const type = post?.$cache.type;

			const stat = post?.statPost;
			const profile = await account?.profile;
			const imgProfile = profile?.imgProfile!;
			resolve({
				//@ts-ignore
				id: element?._id,
				user: {
					name: account?.$cache.name,
					id: account?.$id,
					pic: (imgProfile as UrlData[])[0]?.url,
				},
				action: element.mode,
				statPostTrigger: {
					like: stat?.likes,
					share: stat?.shares,
					comment: stat?.totalCommentsCount,
				},
				createdAt: post?.__updatedAt,
				checked: element.checked,
				messagePost,
				accountPost,
				profilePost,
				post: {
					...post?.$cache,
				},
			});
		});
	});

	if (!promises) return;

	let list = (await Promise.allSettled(promises))
		.filter((s) => s.status === 'fulfilled')
		.map((s) => (s as any).value as NotificationType);

	return list;
};

const trToFR = (str: 'like' | 'shared' | 'create' | 'comment') => {
	switch (str) {
		case 'like':
			return 'a aime ton post';
		case 'shared':
			return 'a partage ton post';
		case 'create':
			return 'a commente ton post';
		case 'comment':
			return 'a commente ton post';
	}
};
