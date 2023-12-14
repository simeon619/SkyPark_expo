// import { create } from 'zustand';
// import { SQuery } from '../..';
// import { mergeArrayData } from '../../../Utilis/functions/utlisSquery';
// import { ArrayData, FileType, getArrayDataInit } from '../../../lib/SQueryClient';
// import { PostInterface } from '../Descriptions';
// import { useAuthStore } from '../auth';

// type surveySchema = {
//   options: { label: string }[];
//   delay: number;
// };
// // const ArrayDataInit = {
// //   added: [],
// //   removed: [],
// //   items: [],
// //   totalItems: 0,
// //   limit: 20,
// //   totalPages: 0,
// //   page: 1,
// //   pagingCounter: 0,
// //   hasPrevPage: false,
// //   hasNextPage: false,
// //   prevPage: null,
// //   nextPage: null,
// // } as ArrayData<any>;

// type supervisorPostSchema = {
//   listPostSupervisor: ArrayData<PostInterface>;
//   loadindGetDataSupervisor: boolean;
//   loadingPublishSupervisor: boolean;

//   publishPostSupervisor: (data: {
//     value?: string;
//     accountId: string | undefined;
//     files?: FileType[];
//     type: string;
//     surveyOptions?: surveySchema;
//   }) => void;
//   getListPostSupervisor: (page: number) => void;
// };

// export const useSupervisorPostStore = create<supervisorPostSchema, any>((set) => ({
//   listPostSupervisor: getArrayDataInit(),
//   loadindGetDataSupervisor: false,
//   loadingPublishSupervisor: false,
//   getListPostSupervisor: async (page: number) => {
//     set(() => {
//       return {
//         loadindGetDataSupervisor: true,
//       };
//     });
//     const quarterId = useAuthStore.getState().quarter?._id;

//     if (!quarterId) return;

//     const quarter = await SQuery.newInstance('quarter', { id: quarterId });

//     const Thread = await quarter?.supervisorThread;

//     if (!Thread) return;

//     Thread.when(
//       'update',
//       async (obj) => {
//         let postId = obj.added[0];
//         if (!postId) return;
//         set(() => {
//           return {
//             loadindGetDataSupervisor: true,
//           };
//         });
//         const post = await SQuery.newInstance('post', { id: postId });

//         post?.when(
//           'refresh',
//           (obj) => {
//             let oldState: PostInterface;
//             set((state) => {
//               const newState = { ...state };

//               let index = newState.listPostSupervisor.items.findIndex((item) => item._id === post.$id);
//               if (index !== -1) {
//                 oldState = newState.listPostSupervisor.items[index];
//               }
//               return {
//                 listPostSupervisor: mergeArrayData(
//                   newState.listPostSupervisor,
//                   { ...newState.listPostSupervisor, items: [{ ...oldState, ...obj }] },
//                   true
//                 ),
//               };
//             });
//           },
//           post.$id
//         );

//         if (!post) return;
//         set((state) => {
//           let ArrayPos = [post.$cache];
//           return {
//             listPostSupervisor: mergeArrayData(
//               state.listPostSupervisor,
//               { ...state.listPostSupervisor, items: ArrayPos },
//               true
//             ),
//             loadindGetData: false,
//           };
//         });
//       },
//       'ThreadQuarte:update'
//     );
//     const posts = await Thread?.update({
//       paging: {
//         page,
//         limit: 3,
//         sort: {
//           __createdAt: -1,
//         },
//       },
//     });
//     console.log('posts', posts);

//     if (!posts) return;
//     await Promise.all(
//       posts.items.map(async (item) => {
//         const post = await SQuery.newInstance('post', { id: item._id });
//         post?.when(
//           'refresh',
//           (obj) => {
//             let oldState: PostInterface;
//             set((state) => {
//               const newState = { ...state };
//               let index = newState.listPostSupervisor.items.findIndex((i) => i._id === post.$id);
//               if (index !== -1) {
//                 oldState = newState.listPostSupervisor.items[index];
//               }
//               return {
//                 listPostSupervisor: mergeArrayData(
//                   newState.listPostSupervisor,
//                   { ...newState.listPostSupervisor, items: [{ ...oldState, ...obj }] },
//                   true
//                 ),
//               };
//             });
//           },
//           post.$id
//         );
//       })
//     );
//     if (posts) {
//       set((state) => {
//         return {
//           listPostSupervisor: mergeArrayData(state.listPostSupervisor, posts),
//           loadindGetDataSupervisor: false,
//         };
//       });
//     }
//   },
//   publishPostSupervisor: async (data) => {
//     set(() => {
//       return {
//         loadingPublishSupervisor: true,
//       };
//     });
//     const { value, accountId, files, type, surveyOptions } = data;

//     if (!accountId) return;
//     const quarterId = useAuthStore.getState().quarter?._id;

//     if (!quarterId) return;

//     const quarter = await SQuery.newInstance('quarter', { id: quarterId });

//     const Thread = await quarter?.Thread;

//     await Thread?.update({
//       addNew: [
//         {
//           message: {
//             text: value,
//             files,
//             account: accountId,
//           },
//           survey: surveyOptions,
//           type,
//         },
//       ],
//     });

//     set((state) => {
//       return {
//         ...state,
//         loadingPublishSupervisor: false,
//       };
//     });
//   },
// }));

// export const getInfoAccount = async (accountId: string | undefined) => {
//   if (!accountId) return;
//   const account = await SQuery.newInstance('account', { id: accountId });
//   if (!account) return;
//   const profile = await account?.profile;
//   if (!profile) return;
//   return {
//     account: account.$cache,
//     profile: profile.$cache,
//   };
// };

// export const getMessagePost = async ({ messageId }: { messageId: string }) => {
//   const message = await SQuery.newInstance('message', { id: messageId });
//   if (!message) return;
//   return message.$cache;
// };
