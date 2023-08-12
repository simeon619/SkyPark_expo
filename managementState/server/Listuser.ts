import { create } from 'zustand';
import { AccountInterface, ProfileInterface, QuarterInterface, UserInterface } from './Descriptions';
import { SQuery } from '..';
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
    const res = await SQuery.service('app', 'userList', {});
    console.log('🚀 ~ file: Listuser.ts:35 ~ setListAccount: ~ res:', res);

    if (res.error) res.error;

    console.log(res.response, 'LISTUSER');

    let users = res.response as any as UserInterface[];
    if (users?.length === 0) return;

    let listAccount = users?.map((user) => user.account);

    let CollectedUser = await SQuery.collector({
      $option: {},
      account: listAccount,
    });

    let Account = await Promise.all(
      CollectedUser.account?.map(async (account) => {
        const profile = await SQuery.newInstance('profile', { id: account.$cache.profile });
        if (!profile) return;
        return { account: account.$cache, profile: profile?.$cache };
      })
    );

    set({ listAccount: Account });
  },
}));
