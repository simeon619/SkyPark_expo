import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { SQuery } from '..';
import { openDatabase } from '../../Utilis/functions/initDB';
import { createTable } from '../../Utilis/models/Conversations/database';
import { DB_NAME } from '../../constants/Value';
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

// import { QueryKeys } from '../../types/serverType';

type authState = {
  account: AccountInterface | undefined;
  user: UserInterface | undefined;
  profile: ProfileInterface | undefined;
  address: AddressInterface | undefined;
  favorites: FavoritesInterface | undefined;
  entreprise: EntrepriseInterface | undefined;
  quarter: QuarterInterface | undefined;
  padiezd: PadiezdInterface | undefined;
  building: BuildingInterface | undefined;
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
      building: undefined,
      favorites: undefined,
      entreprise: undefined,
      quarter: undefined,
      padiezd: undefined,
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
          padiezd: undefined,
          quarter: undefined,
          address: undefined,
          building: undefined,
          favorites: undefined,
          entreprise: undefined,
          isAuth: false,
          loading: false,
          error: undefined,
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
    if (!res.response || !res?.response?.signup.id) {
      set(() => ({
        account: undefined,
        user: undefined,
        profile: undefined,
        padiezd: undefined,
        quarter: undefined,
        address: undefined,
        building: undefined,
        favorites: undefined,
        entreprise: undefined,
        isAuth: false,
        loading: false,
        error: undefined,
      }));

      throw new Error(JSON.stringify(res));
    }

    const user = await SQuery.newInstance('user', { id: res?.response?.signup.id });

    const account = await SQuery.newInstance('account', { id: res?.response?.login.id });

    if (!user) throw new Error('user not found');
    if (!account) throw new Error('account not found');

    let profile = await account.profile;
    let address = await account.address;
    let favorites = await account.favorites;

    let entreprise = await user.entreprise;

    let padiezd = await user?.extractor<'padiezd'>('../');
    let building = await user?.extractor<'building'>('../../');
    let quarter = await user?.extractor<'quarter'>('../../../');

    // quarter.

    SQuery.bind({ account, user, profile, address, favorites, entreprise, quarter, padiezd, building }, set);

    let cache = SQuery.cacheFrom({
      account,
      user,
      profile,
      address,
      favorites,
      entreprise,
      quarter,
      padiezd,
      building,
    });

    const db = await openDatabase(DB_NAME);
    createTable(db);

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
      isAuth: false,
    }));
  } finally {
    set((state) => ({
      ...state,
      loading: false,
    }));
  }
};
