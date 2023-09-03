import { getDiscussionId, putMessageLocal, sendServer } from '../../Utilis/functions/utlisSquery';
import { FileType } from '../../lib/SQueryClient';

const LIMIT_MESSAGES = 20;

// interface MessageSchema {
//   focusedUser: { account: AccountInterface; profile: ProfileInterface } | undefined;
//   messages: Record<string, Record<string, ArrayData<MessageInterface>>>;
//   // messages: Partial<ArrayData<MessageInterface>> | undefined;

//   currentDiscussion: DiscussionInterface | undefined;
//   setFocusedUser: (focusedUser: { account: AccountInterface; profile: ProfileInterface }) => void;
//   sendMessage: (data: { value?: string; accountId: string | undefined; files?: FileType[] }) => Promise<void>;
//   fetchMessages: (data: { discussion: DiscussionInterface; page: number }) => Promise<void>;
//   fetchDiscussion: (accountId: string | undefined) => Promise<void>;
//   deleteCurrentChannel: () => void;
// }

// const DiscussionStorage: any = {};
// let messageStorage: Record<string, Record<string, ArrayData<MessageInterface>>> = {};

// export const useMessageStore = create<any, any>(
//   //   persist(
//   (set) => ({
//     currentChannel: undefined,
//     focusedUser: undefined,
//     currentDiscussion: undefined,
//     messages: {},

//     deleteCurrentChannel: () => set(() => ({ currentDiscussion: undefined })),

//     setFocusedUser: (account) => set(() => ({ focusedUser: account })),

//     fetchDiscussion: async (accountId) => {
//       if (!accountId) {
//         console.error('erreur accountId', accountId);
//         return;
//       }
//       const res = await SQuery.service('messenger', 'createDiscussion', {
//         receiverAccountId: accountId,
//       });

//       if (!res?.response?.id) return;

//       const discussion = await SQuery.newInstance('discussion', { id: res.response.id });
//       if (!discussion) return;

//       set(({}) => ({ currentDiscussion: discussion.$cache }));
//     },
//     fetchMessages: async (data) => {
//       const { discussion, page } = data;

//       if (!discussion._id) {
//         return;
//       }

//       try {
//         const discussionInstance = await SQuery.newInstance('discussion', { id: discussion._id });

//         const channel = await discussionInstance?.channel;
//         const arrayData = await channel?.update({
//           paging: {
//             limit: LIMIT_MESSAGES,
//             page: data.page,
//             sort: {
//               __createdAt: -1,
//             },
//           },
//         });

//         if (arrayData) {
//           set((state) => {
//             let draftState = produce(state, (draft) => {
//               if (!draft.messages) {
//                 draft.messages = {};
//               }
//               if (!draft.messages[discussion._id]) {
//                 draft.messages[discussion._id] = {};
//                 //@ts-ignore
//                 draft.messages[discussion._id][page] = { items: [] };
//               }
//               let newM = mergeArrayData(draft.messages[discussion._id][page], arrayData);

//               draft.messages[discussion._id][page] = newM;
//             });
//             return draftState;
//           });
//         }
//       } catch (error) {
//         console.error('Error fetching messages:', error);
//       }
//     },

//   })
// );

export const sendMessage = async (data: { value?: string; accountId: string | undefined; files?: FileType[] }) => {
  const { accountId, files, value } = data;
  if (!accountId) {
    console.error('Error sending message:', data);
    return;
  }
  let discussionId = await getDiscussionId(accountId);
  if (!discussionId) return;

  try {
    await putMessageLocal(files, value, discussionId, accountId);
    await sendServer(discussionId, accountId, files, value);
  } catch (error) {
    console.error('Error sending message:', error);
  }
};
