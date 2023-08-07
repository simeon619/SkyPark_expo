import { create } from 'zustand';
import { SQuery } from '..';
import { FileType } from '../../lib/SQueryClient';
import { AccountInterface, AddressInterface, ProfileInterface } from './Descriptions';

interface userUpdateAction {
  setProfile: (
    newData: Partial<ProfileInterface> & { _id: string },
    fileData?: { imgProfile?: FileType[]; banner?: FileType[] }
  ) => Promise<void>;
  setAdrress: (newData: Partial<AddressInterface> & { _id: string }) => Promise<void>;
  setAccount: (newData: Partial<AccountInterface> & { _id: string }) => Promise<void>;
}

export const usePatchUser = create<userUpdateAction>(() => ({
  setProfile: async (newData, fileData) => {
    let profile = await SQuery.newInstance('profile', { id: newData._id });

    if (!profile) throw new Error('profile not found');
    profile.update({ ...newData, ...fileData });
  },

  setAdrress: async (newData) => {
    let address = await SQuery.newInstance('address', { id: newData._id });

    if (!address) throw new Error('address not found');

    address.update(newData);
  },

  setAccount: async (newData) => {
    let account = await SQuery.newInstance('account', { id: newData._id });

    if (!account) throw new Error('account not found');
    const accountNew = { ...newData, address: {}, profile: {}, favorites: {}, entreprise: {} };
    account.update(accountNew);
  },
}));
