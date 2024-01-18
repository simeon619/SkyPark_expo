import { create } from 'zustand';
import { SQuery } from '..';

import { getChannel, getDiscussionId } from '../../Utilis/functions/utlisSquery';
import { addUser } from '../../Utilis/models/Chat/userRepository';
import { AccountInterface, ProfileInterface } from './Descriptions';
import { useAuthStore } from './auth';
type ListUserSchema = {
  listAccount: (
    | {
        account: AccountInterface;
        profile: ProfileInterface;
      }
    | undefined
  )[];
  // listQuarter: QuarterInterface[];
  getListAccount: () => void;
  // setListAccount: () => void;
  // setListQuarter: () => void;
};

export const useListUserStore = create<ListUserSchema, any>((set) => ({
  listAccount: [],
  // listQuarter: [],
  getListAccount: async () => {
    const quarterId = useAuthStore.getState().quarter?._id;
    console.log('🚀 ~ getListAccount: ~ quarterId:', quarterId);
    if (!quarterId) return;

    try {
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

      if (res.error) {
        console.error(res.error); // Log the error for debugging
        return;
      }

      //@ts-ignore
      let collectedUser = res.response?.items || [];

      let promises = collectedUser.map(async (account: AccountInterface) => {
        try {
          const profile = await SQuery.newInstance('profile', { id: account.profile });
          if (!profile) throw new Error("Profile doesn't exist");
          return { account, profile: profile?.$cache };
        } catch (error) {
          console.error(error); // Log the error for debugging
          return null;
        }
      });

      let listAccount = (await Promise.allSettled(promises))
        .filter((result) => result.status === 'fulfilled')
        .map((result: any) => result?.value as { account: AccountInterface; profile: ProfileInterface });

      set({ listAccount });
    } catch (error) {
      console.error(error); // Log the error for debugging
    }
  },
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
  //@ts-ignore
  let CollectedUser = res.response?.items || [];

  let promises = CollectedUser.map(async (account: AccountInterface) => {
    return new Promise(async (resolve, reject) => {
      const profile = await SQuery.newInstance('profile', { id: account.profile });
      if (!profile) reject();
      resolve({ account: account, profile: profile?.$cache });
    });
  });

  let ListAccount = (await Promise.allSettled(promises))
    .filter((s) => s.status === 'fulfilled')
    .map((s: any) => s?.value as { account: AccountInterface; profile: ProfileInterface });

  let proccess = ListAccount.map(async (A) => {
    const discussionId = await getDiscussionId(A?.account._id);
    let success = await createUserPromise(
      A?.account._id || '',
      A?.account.name || '',
      A?.profile.imgProfile[0]?.url || '',
      discussionId || ''
    );
    if (success) {
      await getChannel(discussionId);
      return 1;
    }
    return 0;
  });

  function createUserPromise(userId: string, name: string, profile: string, discussionId: string) {
    return new Promise<number>(async (resolve, reject) => {
      try {
        await addUser({
          idUtilisateur: userId,
          nomUtilisateur: name,
          urlPic: profile,
          lastSeen: new Date().getTime(),
          idConversation: discussionId,
        });
        resolve(1);
      } catch (error) {
        reject(error);
      }
    });
  }
  return await Promise.all(proccess);
};
