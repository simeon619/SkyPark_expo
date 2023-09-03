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
      CollectedUser.map(async (account: AccountInterface) => {
        const profile = await SQuery.newInstance('profile', { id: account.profile });
        if (!profile) return;
        return { account: account, profile: profile?.$cache };
      })
    );

    processUsers(Account);

    async function processUsers(
      Account: (
        | {
            account: AccountInterface;
            profile: ProfileInterface;
          }
        | undefined
      )[]
    ) {
      for (const user of Account) {
        let Account = user?.account;
        try {
          await addUserPromise(user);
          await createConversationPromise(Account?._id);
          console.log(`Opérations terminées pour l'utilisateur ${Account?.name}`);
        } catch (error) {
          console.error(`Erreur lors du traitement de l'utilisateur ${Account?.name}:`, error);
        }
      }
    }

    function createConversationPromise(userId: string | undefined) {
      if (!userId) return;
      return new Promise(async (resolve, reject) => {
        const discussionId = await getDiscussionId(userId);
        await getChannel(discussionId);
        if (!discussionId) {
          reject(new Error("L'identifiant de la discussion n'a pas été trouvé."));
          return;
        }

        createPrivateConversation({
          ID_Conversation: discussionId,
          ID_DESTINATAIRE: userId,
          Type_Conversation: 'private',
        })
          .then(() => resolve(1))
          .catch((error) => reject(error));
      });
    }

    function addUserPromise(
      user:
        | {
            account: AccountInterface;
            profile: ProfileInterface;
          }
        | undefined
    ) {
      return new Promise((_resolve, reject) => {
        if (!user) {
          reject(new Error('Utilisateur non défini.'));
          return;
        }
        addUser({
          ID_Utilisateur: user.account._id,
          Nom_Utilisateur: user.account.name,
          Last_Seen: new Date().toLocaleTimeString(),
          Url_Pic: user.profile.imgProfile[0]?.url,
        });
      });
    }

    // Account.map(async (user) => {
    //   return new Promise((resolve) => {});
    // });

    // Account.forEach(async (user) => {
    //   if (!user) return;
    //   addUser({
    //     ID_Utilisateur: user.account._id,
    //     Nom_Utilisateur: user.account.name,
    //     Last_Seen: new Date().toLocaleTimeString(),
    //     Url_Pic: user.profile.imgProfile[0]?.url,
    //   });

    //   let discussionId = await getDiscussionId(user.account._id);

    //   if (!discussionId) return;

    //   createConversation({
    //     ID_Conversation: discussionId,
    //     ID_DESTINATAIRE: user.account._id,
    //     Type_Conversation: 'private',
    //   });
    // });

    // set({ listAccount: Account });
  },
}));
