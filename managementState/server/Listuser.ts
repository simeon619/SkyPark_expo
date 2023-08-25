import { create } from 'zustand';
import { AccountInterface, ProfileInterface, QuarterInterface, UserInterface } from './Descriptions';
import { SQuery } from '..';
import { useAuthStore } from './auth';
const ENTREPRISE_ID = '64d60c4a6412118d1809846c';
type ListUserSchema = {
  listAccount: (
    | {
        account: AccountInterface;
        profile: ProfileInterface;
      }
    | undefined
  )[];
  listQuarter: QuarterInterface[];
  setListAccount: () => void;
  // setListQuarter: () => void;
};

export const useListUserStore = create<ListUserSchema, any>((set) => ({
  listAccount: [],
  listQuarter: [],
  // setListQuarter: async () => {
  //   let entreprise = await SQuery.newInstance('entreprise', { id: ENTREPRISE_ID });
  //   if (!entreprise) return;

  //   let Quarter = await entreprise.quarters;

  //   const ArrayData = await Quarter?.page();

  //   set(() => ({
  //     listQuarter: ArrayData?.items,
  //   }));
  // },
  setListAccount: async () => {
    const quarterId = useAuthStore.getState().quarter?._id;
    if (!quarterId) return;
    const res = await SQuery.service('app', 'childList', {
      childModelPath: 'account',
      parentModelPath: 'quarter',
      parentId: quarterId,
      pagging: {
        page: 1,
        limit: 100,
        query: {},
        select: '',
        sort: {},
      },
    });

    if (res.error) res.error;

    let CollectedUser = res.response?.items || [];

    let Account = await Promise.all(
      CollectedUser.map(async (account) => {
        const profile = await SQuery.newInstance('profile', { id: account.profile });
        if (!profile) return;
        return { account: account, profile: profile?.$cache };
      })
    );

    set({ listAccount: Account });
  },
}));
