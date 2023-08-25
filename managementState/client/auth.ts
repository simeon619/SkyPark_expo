// import AsyncStorage from '@react-native-async-storage/async-storage';

// import { create } from 'zustand';
// import { createJSONStorage, persist } from 'zustand/middleware';
// import type { UserDataType } from '../../types/serverType';

// type authState = {
//   userData: UserDataType | null;
//   isAuth: boolean;
// };
// type authAction = {
//   setAuth: (value: UserDataType) => void;
//   removeAuth: () => void;
// };

// type StateSchema = authAction & authState;
// export const useAuthStore = create<StateSchema, any>(
//   persist(
//     (set) => ({
//       userData: null,
//       isAuth: false,
//       setAuth: (value) => {
//         set(() => ({
//           userData: value,
//           isAuth: true,
//         }));
//       },
//       removeAuth: () => {
//         set({
//           userData: null,
//           isAuth: false,
//         });
//       },
//     }),
//     {
//       name: 'dataUser',
//       storage: createJSONStorage(() => AsyncStorage),
//     }
//   )
// );
