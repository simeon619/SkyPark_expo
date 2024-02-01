import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { SQuery } from '..';
import {
	AccountInterface,
	AddressInterface,
	BuildingInterface,
	EntrepriseInterface,
	FavoritesInterface,
	PadiezdInterface,
	ProfileInterface,
	QuarterInterface,
	UserInterface,
} from './Descriptions';
import { useTypeUser } from '../client/auth';
import { showToast } from '../../Utilis/functions/utlisSquery';

// import { QueryKeys } from '../../types/serverType';

type authState = {
	account: AccountInterface | null;
	user: UserInterface | null;
	profile: ProfileInterface | null;
	address: AddressInterface | null;
	favorites: FavoritesInterface | null;
	entreprise: EntrepriseInterface | null;
	quarter: QuarterInterface | null;
	padiezd: PadiezdInterface | null;
	building: BuildingInterface | null;
	isAuth: boolean;
	loading: boolean;
	error: string | null;
};
type authAction = {
	fetchLogin: (Login: { email: string; password: string }) => Promise<void>;
	fetchDisconnect: () => Promise<void>;
	fetchRegister: (Register: { email: string; password: string; code: string }) => Promise<void>;
	setEvent: () => Promise<void>;
};
type StateSchema = authAction & authState;
export const useAuthStore = create<StateSchema, any>(
	persist(
		(set, get) => ({
			account: null,
			user: null,
			profile: null,
			address: null,
			building: null,
			favorites: null,
			entreprise: null,
			quarter: null,
			padiezd: null,
			isAuth: false,
			loading: false,
			error: null,

			setEvent: async () => {
				const profileId = get().profile?._id!;
				console.log('🚀 ~ setEvent: ~ profileId:', profileId);
				const profile = await SQuery.newInstance('profile', { id: profileId });
				profile?.when(
					'refresh',
					(obj) => {
						//@ts-ignore
						set((state) => {
							return {
								profile: {
									...state.profile,
									...obj,
								},
							};
						});
					},
					profile.$id
				);

				//account
				const accountId = get().account?._id!;

				const account = await SQuery.newInstance('account', { id: accountId });
				account?.when(
					'refresh',
					(obj) => {
						console.log('🚀 ~ account?.when ~ obj:', obj);
						//@ts-ignore
						set((state) => {
							return {
								account: {
									...state.account,
									...obj,
								},
							};
						});
					},
					account.$id
				);

				//address

				const addressId = get().address?._id!;

				const address = await SQuery.newInstance('address', { id: addressId });
				address?.when(
					'refresh',
					(obj) => {
						//@ts-ignore
						set((state) => {
							return {
								address: {
									...state.address,
									...obj,
								},
							};
						});
					},
					address.$id
				);
			},
			fetchDisconnect: async () => {
				set(() => ({
					loading: true,
				}));

				await SQuery.service('server', 'disconnection', {});

				set(() => ({
					account: null,
					user: null,
					profile: null,
					padiezd: null,
					quarter: null,
					address: null,
					building: null,
					favorites: null,
					entreprise: null,
					isAuth: false,
					loading: false,
					error: null,
				}));
			},

			fetchLogin: async (LoginData) => {
				handleAuthAction(set, LoginData);
			},

			fetchRegister: async (RegisterData) => {
				handleAuthAction(set, { email: RegisterData.email, password: RegisterData.password });
			},
		}),

		{
			name: 'authUser',
			storage: createJSONStorage(() => AsyncStorage),
			partialize: (state) =>
				Object.fromEntries(
					Object.entries(state).filter(([key]) => !['loading', 'error'].includes(key))
				),
		}
	)
);
const typeUser = { 1: 'user', 2: 'supervisor' } as const;

const handleAuthAction = async (
	set: (
		partial:
			| StateSchema
			| Partial<StateSchema>
			| ((state: StateSchema) => StateSchema | Partial<StateSchema>),
		replace?: boolean | undefined
	) => void,
	AuthData: {
		email: string;
		password: string;
	}
) => {
	set((state) => ({
		...state,
		loading: true,
		error: null,
	}));

	try {
		console.log('SIGNAL', typeUser[useTypeUser.getState().value]);
		const res = await SQuery.service('login', typeUser[useTypeUser.getState().value], AuthData);
		if (!res.response || !res?.response?.signup.id) {
			set(() => ({
				account: null,
				user: null,
				profile: null,
				padiezd: null,
				quarter: null,
				address: null,
				building: null,
				favorites: null,
				entreprise: null,
				isAuth: false,
				loading: false,
				error: null,
			}));
			showToast(JSON.stringify(res));
			return;
		}

		const user = await SQuery.newInstance(typeUser[useTypeUser.getState().value], {
			id: res?.response?.signup.id,
		});

		const account = await SQuery.newInstance('account', { id: res?.response?.login.id });

		if (!user) throw new Error('user not found');
		if (!account) throw new Error('account not found');

		let profile = await account.profile;
		let address = await account.address;
		let favorites = await account.favorites;
		let padiezd = null;
		let building = null;
		let quarter = null;
		let entreprise = null;
		// let entreprise = await user.entreprise;

		if (account.$cache.status === 'property') {
			padiezd = await user?.extractor<'padiezd'>('../');
			building = await user?.extractor<'building'>('../../');
			quarter = await building?.extractor<'quarter'>('../');
			entreprise = await quarter?.extractor<'entreprise'>('../');
		} else {
			quarter = await user.extractor<'quarter'>('../');
			entreprise = await quarter?.extractor<'entreprise'>('../');
		}

		profile?.when(
			'refresh',
			(obj) => {
				//@ts-ignore
				set((state) => {
					return {
						profile: {
							...state.profile,
							...obj,
						},
					};
				});
			},
			profile.$id
		);

		address?.when(
			'refresh',
			(obj) => {
				//@ts-ignore
				set((state) => {
					return {
						address: {
							...state.address,
							...obj,
						},
					};
				});
			},
			address.$id
		);

		favorites?.when(
			'refresh',
			(obj) => {
				//@ts-ignore
				set((state) => {
					return {
						favorites: {
							...state.favorites,
							...obj,
						},
					};
				});
			},
			favorites.$id
		);
		entreprise?.when('refresh', (obj) => {
			//@ts-ignore
			set((state) => {
				return {
					entreprise: {
						...state.entreprise,
						...obj,
					},
				};
			});
		});

		quarter?.when(
			'refresh',
			(obj) => {
				//@ts-ignore
				set((state) => {
					return {
						quarter: {
							...state.quarter,
							...obj,
						},
					};
				});
			},
			quarter.$id
		);

		padiezd?.when(
			'refresh',
			//@ts-ignore
			(obj) => {
				//@ts-ignore
				set((state) => {
					return {
						padiezd: {
							...state.padiezd,
							...obj,
						},
					};
				});
			},
			padiezd.$id
		);

		building?.when(
			'refresh',
			(obj) => {
				//@ts-ignore
				set((state) => {
					return {
						building: {
							...state.building,
							...obj,
						},
					};
				});
			},
			building.$id
		);

		// createTable(db);

		set(() => ({
			profile: profile?.$cache,
			address: address?.$cache,
			account: account.$cache,
			building: building?.$cache,
			entreprise: entreprise?.$cache,
			quarter: quarter?.$cache,
			padiezd: padiezd?.$cache,
			favorites: favorites?.$cache,
			user: user.$cache,
			isAuth: true,
			loading: false,
		}));
	} catch (error) {
		set((state) => ({
			...state,
			error: JSON.stringify(error),
			loading: false,
			isAuth: false,
		}));
	} finally {
		set((state) => ({
			...state,
			loading: false,
		}));
	}
};
