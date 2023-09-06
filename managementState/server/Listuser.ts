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
    let accountId = useAuthStore.getState().account?._id;
    if (!accountId) return 0;
    let success = await createUserPromise(
      A?.account._id || '',
      A?.account.name || '',
      A?.profile.imgProfile[0]?.url || ''
    );
    if (success) {
      const discussionId = await getDiscussionId(A?.account._id);
      await getChannel(discussionId, accountId);
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

  // try {
  //   const ListAccount = await Promise.all(
  //     CollectedUser.map(async (account) => {
  //       const profile = await SQuery.newInstance('profile', { id: account.profile });
  //       if (!profile) return null;
  //       return { account, profile: profile?.$cache };
  //     })
  //   );

  //   await Promise.all(
  //     ListAccount.map(async (A) => {
  //       addUser({
  //         ID_Utilisateur: A?.account._id || '',
  //         Nom_Utilisateur: A?.account.name || '',
  //         Url_Pic: A?.profile.imgProfile[0]?.url,
  //         Last_Seen: new Date().getTime(),
  //       });

  //       const discussionId = await getDiscussionId(A?.account._id || '');

  //       const accountId = useAuthStore.getState().account?._id;
  //       if (!accountId) return;

  //       await createConversationPromise(accountId, discussionId);
  //       await getChannel(discussionId, accountId);
  //     })
  //   );

  // } catch (error) {
  //   console.error('Error processing user accounts:', error);
  // }

  // processUsers(Account);

  // async function processUsers(
  //   Account: (
  //     | {
  //         account: AccountInterface;
  //         profile: ProfileInterface;
  //       }
  //     | undefined
  //   )[]
  // ) {
  //   for (const user of Account) {
  //     let Account = user?.account;
  //     try {
  //       await addUserPromise(user);
  //       // await createConversationPromise(Account?._id);
  //     } catch (error) {
  //       console.error(`Erreur lors du traitement de l'utilisateur ${Account?.name}:`, error);
  //     }
  //   }
  // }

  // function createConversationPromise(userId: string | undefined) {
  //   if (!userId) return;
  //   return new Promise(async (resolve, reject) => {
  //     const discussionId = await getDiscussionId(userId);
  //     await getChannel(discussionId);
  //     if (!discussionId) {
  //       reject(new Error("L'identifiant de la discussion n'a pas été trouvé."));
  //       return;
  //     }

  //     createPrivateConversation({
  //       ID_Conversation: discussionId,
  //       ID_DESTINATAIRE: userId,
  //       Type_Conversation: 'private',
  //     })
  //       .then(() => resolve(1))
  //       .catch((error) => reject(error));
  //   });
  // }

  // function addUserPromise(
  //   user:
  //     | {
  //         account: AccountInterface;
  //         profile: ProfileInterface;
  //       }
  //     | undefined
  // ) {
  //   return new Promise((_resolve, reject) => {
  //     if (!user) {
  //       reject(new Error('Utilisateur non défini.'));
  //       return;
  //     }
  //     addUser({
  //       ID_Utilisateur: user.account._id,
  //       Nom_Utilisateur: user.account.name,
  //       Url_Pic: user.profile.imgProfile[0]?.url,
  //       Last_Seen: new Date().getTime(),
  //     });
  //   });
  // }
};
