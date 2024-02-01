import { create } from 'zustand';
import { SQuery } from '..';
import { FileType } from '../../lib/SQueryClient';
import { useAuthStore } from './auth';
import { combine } from 'zustand/middleware';

interface userUpdateAction {
	setProfile: (fileData?: { imgProfile?: FileType[]; banner?: FileType[] }) => Promise<void>;
	setAdrress: (newData: { etage?: string; room?: string; city?: string }) => Promise<void>;
	// setAccount: (newData: Partial<AccountInterface>) => Promise<void>;
}

// export const usePatchUser = create<userUpdateAction>(() => ({
// 	setProfile: async (fileData) => {
// 		const profileId = useAuthStore.getState().profile?._id!;
// 		let profile = await SQuery.newInstance('profile', { id: profileId });
// 		if (!profile) return;
// 		profile.imgProfile = fileData?.imgProfile;
// 	},
// 	setAdrress: async (newData) => {
// 		const addressId = useAuthStore.getState().address?._id!;
// 		let address = await SQuery.newInstance('address', { id: addressId });
// 		if (!address) throw new Error('address not found');
// 		if (newData?.city) {
// 			address.city = newData?.city;
// 		}
// 		if (newData?.room) {
// 			address.etage = newData?.room;
// 		}
// 		if (newData?.etage) {
// 			address.etage = newData?.etage;
// 		}
// 	},
// }));

// export const usePatchUser = create<userUpdateAction>(() => ({}))

export const usePatchUser = create(
	combine({}, () => ({
		setUpdateInfo: async (newData: {
			etage?: string;
			room?: string;
			city?: string;
			name?: string;
			email?: string;
			telephone?: string;
			imgProfile?: FileType[];
			banner?: FileType[];
		}) => {
			const addressId = useAuthStore.getState().address?._id!;
			const profileId = useAuthStore.getState().profile?._id!;
			const accountId = useAuthStore.getState().account?._id!;

			const address = await SQuery.newInstance('address', { id: addressId });
			const profile = await SQuery.newInstance('profile', { id: profileId });
			const account = await SQuery.newInstance('account', { id: accountId });

			if (!address || !profile || !account) {
				throw new Error('Some data not found');
			}

			if (newData?.telephone) account.telephone = newData.telephone;
			if (newData?.email) account.email = newData.email;
			if (newData?.name) account.name = newData.name;
			if (newData?.banner) profile.banner = newData.banner;
			if (newData?.imgProfile) profile.imgProfile = newData.imgProfile;
			if (newData?.city) address.city = newData.city;
			if (newData?.room) address.etage = newData.room;
			if (newData?.etage) address.etage = newData.etage;
		},
	}))
);
