import { produce } from 'immer';
import { create } from 'zustand';
import { SQuery } from '..';

import { getChannel, getDiscussionId, mergeArrayData } from '../../Utilis/functions/utlisSquery';
import { ArrayData, FileType } from '../../lib/SQueryClient';
import { AccountInterface, DiscussionInterface, MessageInterface, ProfileInterface } from './Descriptions';

const LIMIT_MESSAGES = 20;

interface MessageSchema {
  focusedUser: { account: AccountInterface; profile: ProfileInterface } | undefined;
  messages: Record<string, Record<string, ArrayData<MessageInterface>>>;
  // messages: Partial<ArrayData<MessageInterface>> | undefined;

  currentDiscussion: DiscussionInterface | undefined;
  setFocusedUser: (focusedUser: { account: AccountInterface; profile: ProfileInterface }) => void;
  sendMessage: (data: { value?: string; accountId: string | undefined; files?: FileType[] }) => Promise<void>;
  fetchMessages: (data: { discussion: DiscussionInterface; page: number }) => Promise<void>;
  fetchDiscussion: (accountId: string | undefined) => Promise<void>;
  deleteCurrentChannel: () => void;
}

// const DiscussionStorage: any = {};
// let messageStorage: Record<string, Record<string, ArrayData<MessageInterface>>> = {};

export const useMessageStore = create<MessageSchema, any>(
  //   persist(
  (set) => ({
    currentChannel: undefined,
    focusedUser: undefined,
    currentDiscussion: undefined,
    messages: {},

    deleteCurrentChannel: () => set(() => ({ currentDiscussion: undefined })),

    setFocusedUser: (account) => set(() => ({ focusedUser: account })),

    fetchDiscussion: async (accountId) => {
      if (!accountId) {
        console.error('erreur accountId', accountId);
        return;
      }
      const res = await SQuery.service('messenger', 'createDiscussion', {
        receiverAccountId: accountId,
      });

      if (!res?.response?.id) return;

      const discussion = await SQuery.newInstance('discussion', { id: res.response.id });
      if (!discussion) return;

      set(({}) => ({ currentDiscussion: discussion.$cache }));
    },
    fetchMessages: async (data) => {
      const { discussion, page } = data;

      if (!discussion._id) {
        return;
      }

      try {
        const discussionInstance = await SQuery.newInstance('discussion', { id: discussion._id });

        const channel = await discussionInstance?.channel;
        const arrayData = await channel?.update({
          paging: {
            limit: LIMIT_MESSAGES,
            page: data.page,
            sort: {
              __createdAt: -1,
            },
          },
        });

        if (arrayData) {
          set((state) => {
            let draftState = produce(state, (draft) => {
              if (!draft.messages) {
                draft.messages = {};
              }
              if (!draft.messages[discussion._id]) {
                draft.messages[discussion._id] = {};
                //@ts-ignore
                draft.messages[discussion._id][page] = { items: [] };
              }
              let newM = mergeArrayData(draft.messages[discussion._id][page], arrayData);

              draft.messages[discussion._id][page] = newM;
            });
            return draftState;
          });
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    },

    sendMessage: async (data) => {
      const { accountId, files, value } = data;
      if (!accountId) {
        console.error('Error sending message:', data);
        return;
      }

      try {
        let discussionId = await getDiscussionId(accountId);

        let channel = await getChannel(discussionId);

        channel?.when(
          'update',
          async (obj: any) => {
            let messageId = obj?.added[0];

            if (!messageId) return;

            let messageInstance = await SQuery.newInstance('message', { id: messageId });

            if (!messageInstance) return;

            let newMessage = messageInstance.$cache;

            // set((state) => {
            //   return produce(state, (draftState) => {
            //     const newLastPageMessages = draftState.messages[discussionId]['1']?.items || [];
            //     const updatedItems = [newMessage, ...newLastPageMessages];
            //     //@ts-ignore
            //     draftState.messages[discussionId]['1'] = {
            //       ...draftState.messages[discussionId]['1'],
            //       items: updatedItems,
            //     };
            //   });
            // });
          },
          'sendMessage:Discussion'
        );
        await channel?.update({
          addNew: [
            {
              account: accountId,
              text: value,
              files: files,
            },
          ],
        });
      } catch (error) {
        console.error('Error sending message:', error);
      }
    },
  })
  //     ,
  //     {
  //       name: 'discussion',
  //       storage: createJSONStorage(() => AsyncStorage),
  //     }
  //   )
);
