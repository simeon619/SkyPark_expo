import { create } from 'zustand';
import { AccountInterface, DiscussionInterface, MessageInterface, ProfileInterface } from './Descriptions';
import { SQuery } from '..';
import { ArrayData, FileType, UrlData } from '../../lib/SQueryClient';
import { produce } from 'immer';

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
const DiscussionStorage: any = {};
let messageStorage: Record<string, Record<string, ArrayData<MessageInterface>>> = {};

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
      console.log('data de fetcMessages', data);

      const { discussion, page } = data;

      if (!discussion._id) {
        console.error('Error fetching messages:', data);
        return;
      }

      if (!messageStorage[discussion._id]) {
        messageStorage[discussion._id] = {};
      }
      console.log({ messageStorage });

      if (messageStorage[discussion._id][data.page]) {
        set((state) => {
          return produce(state, (draft) => {
            const existingMessages = draft.messages[discussion._id][page];
            let newMessages = messageStorage[discussion._id][page];
            const newItems = newMessages?.items || [];

            let mergesMessage = { ...newMessages, items: newItems };

            draft.messages[discussion._id][page] = mergeMessageData(existingMessages, mergesMessage);
          });
        });
      } else {
        try {
          console.log({ discussion });

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
            messageStorage[discussion._id][page] = arrayData;
            set((state) => {
              let draftState = produce(state, (draft) => {
                console.log({ draft: draft.messages });

                if (!draft.messages) {
                  draft.messages = {};
                }
                if (!draft.messages[discussion._id]) {
                  draft.messages[discussion._id] = {};
                  //@ts-ignore
                  draft.messages[discussion._id][page] = { items: [] };
                }
                let newM = mergeMessageData(draft.messages[discussion._id][page], arrayData);

                draft.messages[discussion._id][page] = newM;
              });
              return draftState;
            });
          }
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      }
    },

    sendMessage: async (data) => {
      const { accountId, files, value } = data;
      if (!accountId) {
        console.error('Error sending message:', data);
        return;
      }

      try {
        let discussionId = '';
        if (!DiscussionStorage[accountId]) {
          const res = await SQuery.service('messenger', 'createDiscussion', {
            receiverAccountId: accountId,
          });

          if (!res.response?.id) return;
          discussionId = res.response.id;
        } else {
          discussionId = DiscussionStorage[accountId];
        }
        DiscussionStorage[accountId] = discussionId;

        const discussion = await SQuery.newInstance('discussion', { id: discussionId });

        if (!discussion) return;

        const ArrayDiscussion = await discussion.channel;

        ArrayDiscussion?.when(
          'refresh',
          async (obj) => {
            let messageId = obj?.added[0];
            if (!messageId) return;

            let messageInstance = await SQuery.newInstance('message', { id: messageId });

            if (!messageInstance) return;

            let newMessage = messageInstance.$cache;

            messageStorage[discussionId]['1']?.items.unshift(newMessage);

            set((state) => {
              return produce(state, (draftState) => {
                const newLastPageMessages = draftState.messages[discussionId]['1']?.items || [];
                const updatedItems = [newMessage, ...newLastPageMessages];
                //@ts-ignore
                draftState.messages[discussionId]['1'] = {
                  ...draftState.messages[discussionId]['1'],
                  items: updatedItems,
                };
              });
            });
          },
          'sendMessage:Discussion'
        );
        await ArrayDiscussion?.update({
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
function mergeMessageData(existingData: ArrayData<MessageInterface>, newData: Partial<ArrayData<MessageInterface>>) {
  console.log({ existingData, newData });
  const uniqueIds = new Set(existingData?.items.map((item) => item._id));

  newData?.items?.forEach((newItem) => {
    if (!uniqueIds.has(newItem._id)) {
      uniqueIds.add(newItem._id);
      existingData?.items.push(newItem);
    }
  });

  return {
    items: existingData?.items || [],
    hasNextPage: newData?.hasNextPage || false,
    totalItems: newData?.totalItems || 0,
    totalPages: newData?.totalPages || 0,
    pagingCounter: newData?.pagingCounter || 0,
    nextPage: newData?.nextPage || 0,
    page: newData?.page || 0,
    limit: newData?.limit || 0,
    added: newData?.added || [],
    removed: newData?.removed || [],
    hasPrevPage: newData?.hasPrevPage || false,
    prevPage: newData?.prevPage || 0,
  };
}
