// import { SQuery } from '..';

// import { PrepareImageType } from '../../types/MediaType';
// import { QueryKeys } from '../../types/serverType';
// import { ProfileInterface } from './Descriptions';

// /**
//  * Fetches user data based on the provided userId.
//  *
//  * @param {string} userId - The ID of the user.
//  * @return {Promise<object>} An object containing the user's account and user data.
//  */
// const fetchUserData = async (userId: string) => {
//   console.log({ userId });
//   const user = await SQuery.newInstance('user', { id: userId });

//   if (!user) throw new Error('user not found');

//   const listenerUser = () => {
//     queryClient.invalidateQueries([QueryKeys.user]);
//   };
//   listenerUser.uid = user.$cache?._id + 'fecthUserData';

//   user.when('refresh', listenerUser);

//   const account = await SQuery.newInstance('account', { id: user.$cache?.account });
//   const listenerAcccount = () => {
//     queryClient.invalidateQueries([QueryKeys.user]);
//   };
//   listenerAcccount.uid = user.$cache?.account + 'fecthUserData';
//   account?.when('refresh', listenerAcccount);

//   if (!account) throw new Error('account not found');

//   return { ...account.$cache, ...user.$cache };
// };

// const patchProfileAccount = async ({
//   accountId,
//   data,
// }: {
//   accountId: string | undefined;
//   data: PrepareImageType[];
// }) => {
//   console.log('errrrrrrrrrrrrrrrrrrrrrrrrrrrr', {
//     accountId,
//     data,
//   });

//   if (!accountId) return;

//   const account = await SQuery.newInstance('account', { id: accountId });
//   if (!account) throw new Error('user not found');

//   let profileInstance = await account.profile;

//   if (!profileInstance) throw new Error('profile not found');

//   const listenerProfile = () => {
//     queryClient.invalidateQueries([QueryKeys.profile]);
//   };
//   listenerProfile.uid = account.$cache?._id + 'patchProfileAccount';
//   profileInstance.when('refresh', listenerProfile);

//   profileInstance.imgProfile = [data[0]];

//   return { ...profileInstance.$cache };
// };

// /**
//  * Fetches an address based on the given address ID.
//  *
//  * @param {string} idAddress - The ID of the address to fetch.
//  * @return {Promise<object>} The fetched address.
//  */
// const fetchAddress = async (idAddress: string) => {
//   const address = await SQuery.newInstance('address', { id: idAddress });
//   if (!address) throw new Error('address not found');
//   const listenerAddress = () => {
//     queryClient.invalidateQueries([QueryKeys.address]);
//   };
//   listenerAddress.uid = address.$cache?._id + 'fecthAddress';

//   address.when('refresh', listenerAddress);

//   return address.$cache;
// };

// /**
//  * Fetches a profile based on the provided ID.
//  *
//  * @param {string} idProfile - The ID of the profile to fetch.
//  * @return {Promise<Object>} The fetched profile object.
//  */
// const fetchProfile = async (idProfile: string) => {
//   const profile = await SQuery.newInstance('profile', { id: idProfile });
//   if (!profile) throw new Error('profile not found');

//   const listenerProfile = async (a: any) => {
//     queryClient.setQueryData<ProfileInterface>([QueryKeys.profile], (oldData) => {
//       queryClient.invalidateQueries([QueryKeys.profile]);
//       console.log({ oldData, a });
//       let u1 = oldData?.imgProfile[0].url;
//       let u2 = a.imgProfile[0].url;
//       console.log({ u1, u2 });

//       return { ...oldData, ...a };
//     });
//   };
//   listenerProfile.uid = profile.$cache?._id + 'fecthProfile';

//   profile.when('refresh', listenerProfile);
//   return profile.$cache;
// };

// /**
//  * Fetches a favorite item from the 'favorites' collection based on the provided id.
//  *
//  * @param {string} idFavorite - The id of the favorite item to fetch.
//  * @return {object | undefined} The fetched favorite item from the cache, or undefined if not found.
//  */
// const fetchFavorites = async (idFavorite: string) => {
//   const favorite = await SQuery.newInstance('favorites', { id: idFavorite });
//   if (!favorite) throw new Error('favorite not found');

//   const listenerFavorite = () => {
//     queryClient.invalidateQueries([QueryKeys.favorites]);
//   };
//   listenerFavorite.uid = favorite.$cache?._id + 'fecthFavorites';

//   favorite.when('refresh', listenerFavorite);

//   return favorite?.$cache;
// };

// export { fetchAddress, fetchFavorites, fetchProfile, fetchUserData, patchProfileAccount };
