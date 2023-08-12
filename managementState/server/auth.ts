import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { SQuery } from '..';
import {
  AccountInterface,
  AddressInterface,
  EntrepriseInterface,
  FavoritesInterface,
  ProfileInterface,
  UserInterface,
} from './Descriptions';

// import { QueryKeys } from '../../types/serverType';

type authState = {
  account: AccountInterface | undefined;
  user: UserInterface | undefined;
  profile: ProfileInterface | undefined;
  address: AddressInterface | undefined;
  favorites: FavoritesInterface | undefined;
  entreprise: EntrepriseInterface | undefined;
  isAuth: boolean;
  loading: boolean;
  error: string | undefined;
};
type authAction = {
  fetchLogin: (Login: { email: string; password: string }) => Promise<void>;
  fetchDisconnect: () => Promise<void>;
  fetchRegister: (Register: { email: string; password: string; code: string }) => Promise<void>;
};
type StateSchema = authAction & authState;
export const useAuthStore = create<StateSchema, any>(
  persist(
    (set) => ({
      account: undefined,
      user: undefined,
      profile: undefined,
      address: undefined,
      favorites: undefined,
      entreprise: undefined,
      isAuth: false,
      loading: false,
      error: undefined,
      fetchDisconnect: async () => {
        set(() => ({
          loading: true,
        }));

        await SQuery.service('server', 'disconnection', {});

        set(() => ({
          account: undefined,
          user: undefined,
          profile: undefined,
          address: undefined,
          favorites: undefined,
          entreprise: undefined,
          isAuth: false,
          loading: false,
          error: undefined,
        }));

        set(() => ({
          loading: false,
        }));
      },

      fetchLogin: async (LoginData) => {
        console.log(LoginData);

        handleAuthAction(set, LoginData);
      },

      fetchRegister: async (RegisterData) => {
        // if(RegisterData.code  !==  "4580") {
        //   set(() => ({
        //     loading: false,
        //     error: "Code incorrect",
        //   }))
        // }
        handleAuthAction(set, { email: RegisterData.email, password: RegisterData.password });
      },
    }),

    {
      name: 'authUser',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) =>
        Object.fromEntries(Object.entries(state).filter(([key]) => !['loading', 'error'].includes(key))),
    }
  )
);

const handleAuthAction = async (
  set: (
    partial: StateSchema | Partial<StateSchema> | ((state: StateSchema) => StateSchema | Partial<StateSchema>),
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
    error: undefined,
  }));

  try {
    const res = await SQuery.service('login', 'user', AuthData);
    console.log('🚀 ~ file: auth.ts:113 ~ res:', res);

    if (!res.response || !res?.response?.signup.id) throw new Error(JSON.stringify(res));
    const user = await SQuery.newInstance('user', { id: res?.response?.signup.id });

    const account = await SQuery.newInstance('account', { id: res?.response?.login.id });

    if (!user) throw new Error('user not found');
    if (!account) throw new Error('account not found');

    let profile = await account.profile;
    let address = await account.address;
    let favorites = await account.favorites;

    let entreprise = await user.entreprise;

    SQuery.bind({ account, user, profile, address, favorites, entreprise }, set);

    let cache = SQuery.cacheFrom({
      account,
      user,
      profile,
      address,
      favorites,
      entreprise,
    });

    set(() => ({
      ...cache,
      isAuth: true,
      loading: false,
    }));
  } catch (error) {
    set((state) => ({
      ...state,
      error: JSON.stringify(error),
      loading: false,
    }));
  }
};
