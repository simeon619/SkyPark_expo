import { create } from 'zustand';
import { AccountInterface, DiscussionInterface, MessageInterface, ProfileInterface } from './Descriptions';
import { SQuery } from '..';
import { ArrayData } from '../../lib/SQueryClient';
import { produce } from 'immer';
import { de } from 'date-fns/locale';

const LIMIT_MESSAGES = 20;

interface MessageSchema {
  focusedUser: { account: AccountInterface; profile: ProfileInterface } | undefined;
  messages: Partial<ArrayData<MessageInterface>> | undefined;

  currentDiscussion: DiscussionInterface | undefined;
  setFocusedUser: (focusedUser: { account: AccountInterface; profile: ProfileInterface }) => void;
  sendMessage: (data: { value: string; accountId: string | undefined }) => Promise<void>;
  fetcMessages: (data: { discussion: DiscussionInterface; page: number }) => Promise<void>;
  fetchDiscussion: (accountId: string | undefined) => Promise<void>;

  DeleteCurentChannel: () => void;
}
const DiscussionStorage: any = {};
const messageStorage: Record<string, Record<string, ArrayData<MessageInterface>>> = {};

export const useMessageStore = create<MessageSchema, any>(
  //   persist(
  (set) => ({
    currentChannel: undefined,
    focusedUser: undefined,
    currentDiscussion: undefined,
    messages: undefined,

    DeleteCurentChannel: () => set(() => ({ currentDiscussion: undefined })),

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
    fetcMessages: async (data) => {
      console.log('🚀 ~ file: Discussion.ts:51 ~ fetcMessages: ~ data:', messageStorage);

      if (!data.discussion) {
        console.error('Error fetching messages:', data);
        return;
      }

      if (!messageStorage[data.discussion._id]) {
        messageStorage[data.discussion._id] = {};
      }

      if (messageStorage[data.discussion._id][data.page]) {
        set((state) => {
          return produce(state, (draft) => {
            const existingMessages = draft.messages?.items || [];
            const newMessages = messageStorage[data.discussion._id][data.page]?.items || [];
            draft.messages = {
              ...draft.messages,
              items: existingMessages.concat(newMessages),
              hasNextPage: messageStorage[data.discussion._id][data.page]?.hasNextPage,
              totalItems: messageStorage[data.discussion._id][data.page]?.totalItems,
              totalPages: messageStorage[data.discussion._id][data.page]?.totalPages,
              pagingCounter: messageStorage[data.discussion._id][data.page]?.pagingCounter,
              nextPage: messageStorage[data.discussion._id][data.page]?.nextPage,
              page: messageStorage[data.discussion._id][data.page]?.page,
              limit: messageStorage[data.discussion._id][data.page]?.limit,
            };
          });
        });
      } else {
        const discussion = await SQuery.newInstance('discussion', { id: data.discussion._id });
        console.log('🚀 ~ file: Discussion.ts:56 ~ fetcMessages: ~ discussion:', discussion);

        const channel = await discussion?.channel;

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
          messageStorage[data.discussion._id][data.page] = arrayData;
        }
        // { messages: messageStorage[data.discussion._id][data.page]  }
        set((state: MessageSchema) => {
          return produce(state, (draft) => {
            const newMessages = messageStorage[data.discussion._id][data.page]?.items || [];
            const existingMessages = draft.messages?.items || [];
            draft.messages = {
              items: existingMessages.concat(newMessages),
              hasNextPage: messageStorage[data.discussion._id][data.page]?.hasNextPage,
              totalItems: messageStorage[data.discussion._id][data.page]?.totalItems,
              totalPages: messageStorage[data.discussion._id][data.page]?.totalPages,
              pagingCounter: messageStorage[data.discussion._id][data.page]?.pagingCounter,
              nextPage: messageStorage[data.discussion._id][data.page]?.nextPage,
              page: messageStorage[data.discussion._id][data.page]?.page,
              limit: messageStorage[data.discussion._id][data.page]?.limit,
            };
          });
        });
      }
    },

    sendMessage: async (data) => {
      if (!data.accountId || !data.value) {
        console.error('Error sending message:', data);
        return;
      }
      try {
        let discussionId = '';
        if (!DiscussionStorage[data.accountId]) {
          const res = await SQuery.service('messenger', 'createDiscussion', {
            receiverAccountId: data.accountId,
          });

          if (!res.response?.id) return;
          discussionId = res.response.id;
        } else {
          discussionId = DiscussionStorage[data.accountId];
        }
        DiscussionStorage[data.accountId] = discussionId;

        const discussion = await SQuery.newInstance('discussion', { id: discussionId });

        if (!discussion) return;

        const ArrayDiscussion = await discussion.channel;

        ArrayDiscussion?.when(
          'refresh',
          async (obj) => {
            console.log('🚀 ~ file: Discussion.ts:151 ~ messageStorage:', messageStorage);
            let messageId = obj?.added[0];
            if (!messageId) return;

            let messageInstance = await SQuery.newInstance('message', { id: messageId });

            if (!messageInstance) return;

            let newMessage = messageInstance.$cache;

            const pages = Object.keys(messageStorage[discussionId]);
            const lastPage = pages[pages.length - 1];
            const lastPageMessages = messageStorage[discussionId][lastPage];

            if (lastPageMessages) {
              if (lastPageMessages?.items.length <= LIMIT_MESSAGES) {
                produce(lastPageMessages, (draftState) => {
                  draftState?.items.unshift(newMessage);
                });
              } else {
                const newPageNumber = parseInt(lastPage) + 1;
                produce(messageStorage[discussionId][newPageNumber], (draftState) => {
                  draftState?.items.unshift(newMessage);
                });
              }
            }
            set(
              produce((state) => {
                state.messages?.items?.unshift(newMessage);
              })
            );
          },
          'sendMessage:Discussion'
        );

        // const newMessageData = {
        //   account: data.accountId,
        //   text: data.value,
        //   files: undefined,
        // };

        ArrayDiscussion?.update({
          addNew: [
            {
              account: data.accountId,
              text: data.value,
              files: undefined,
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
