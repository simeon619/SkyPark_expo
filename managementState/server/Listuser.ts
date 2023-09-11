import { create } from 'zustand';
import { SQuery } from '..';

import { getChannel, getDiscussionId } from '../../Utilis/functions/utlisSquery';
import { createPrivateConversation } from '../../Utilis/models/Chat/messageReposotory';
import { addUser } from '../../Utilis/models/Chat/userRepository';
import { AccountInterface, ProfileInterface, QuarterInterface } from './Descriptions';
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
  // setListAccount: () => void;
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
}));

export const setListAccount = async () => {
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

  let ListAccount = await Promise.all(
    CollectedUser.map(async (account: AccountInterface) => {
      const profile = await SQuery.newInstance('profile', { id: account.profile });
      if (!profile) return;
      return { account: account, profile: profile?.$cache };
    })
  );

  let proccess = ListAccount.map(async (A) => {
    let success = await createUserPromise(
      A?.account._id || '',
      A?.account.name || '',
      A?.profile.imgProfile[0]?.url || ''
    );
    if (success) {
      const discussionId = await getDiscussionId(A?.account._id);
      await getChannel(discussionId);
      return 1;
    }
    return 0;
  });

  function createUserPromise(userId: string, name: string, profile: string) {
    return new Promise<number>(async (resolve, reject) => {
      try {
        await addUser({
          ID_Utilisateur: userId,
          Nom_Utilisateur: name,
          Url_Pic: profile,
          Last_Seen: new Date().getTime(),
        });
        resolve(1);
      } catch (error) {
        reject(error);
      }
    });
  }
  return await Promise.all(proccess);
};
