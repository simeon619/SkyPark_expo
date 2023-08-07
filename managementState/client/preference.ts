import AsyncStorage from '@react-native-async-storage/async-storage';

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { icons } from '../../Utilis/data';

type StateSchema = {
  primaryColourLight: string;
  primaryColour: string;
  name: string;
};

export const stateApp: { [key: string]: StateSchema } = {
  B: {
    primaryColourLight: '#E6D6F8',
    primaryColour: '#A85DFD',
    name: 'Building',
  },
  N: {
    primaryColour: '#EA9093',
    primaryColourLight: '#E8BBBE',
    name: 'Neighbor',
  },
};

type ToggleState = {
  primaryColourLight: string;
  primaryColour: string;
  name: string;
  toggleState: () => void;
};

export const useToggleStore = create<ToggleState, any>(
  persist<ToggleState>(
    (set, get) => ({
      primaryColourLight: stateApp['B'].primaryColourLight,
      primaryColour: stateApp['B'].primaryColour,
      name: stateApp['B'].name,
      toggleState: () => {
        set((state) => {
          const nextStateKey = get().primaryColour === stateApp['B'].primaryColour ? 'N' : 'B';
          const nextState = stateApp[nextStateKey];
          return {
            primaryColourLight: nextState.primaryColourLight,
            primaryColour: nextState.primaryColour,
            name: nextState.name,
          };
        });
      },
    }),
    {
      name: 'toggleApp',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useToggleStore;

/****************************************TYPEFORM********************************************* */
interface Icon {
  url: string;
  name: string;
}

export type IconName = (typeof icons)[number]['name'];

export const typeform: IconName = 'Client';

type stateForm = {
  IconName: IconName;
  switchForm: (value: IconName) => void;
};

export const useTypeForm = create<stateForm, any>(
  persist(
    (set, get) => ({
      IconName: 'Annonce',
      switchForm: (value: IconName) => {
        set({ IconName: value });
      },
    }),
    { name: 'formType', storage: createJSONStorage(() => AsyncStorage) }
  )
);

//////////////////////////////////////////////////////////////// ViewerParamImages ********************************
// type ImageSchemaForm = {
//   images: {
//     uri: string;
//   }[];
//   actualIndex: number;
// };

// type ViewerParamImages = {
//   data: ImageSchemaForm;
//   setParmsImagesForm: (value: ImageSchemaForm) => void;
// };

// export const useViewerParamImages = create<ViewerParamImages>((set, get) => ({
//   data: { actualIndex: 0, images: [] },
//   setParmsImagesForm: (value: ImageSchemaForm) => {
//     if (JSON.stringify(value) !== JSON.stringify(get().data)) {
//       set(() => ({ data: value }));
//     }
//   },
// }));

//////////////////////////////////////////////////////// MENUinMessage/////////////////

type MenuDiscussionIsOpen = {
  ctxMenu: boolean;
  toggleValue: () => void;
};

export const useMenuDiscussionIsOpen = create<MenuDiscussionIsOpen>((set) => ({
  ctxMenu: false,
  toggleValue() {
    set((state) => ({ ctxMenu: !state.ctxMenu }));
  },
}));
//////////////////////////////////////////////////////////////ModalTimeSurvey////////////////////////////

type ModalTimeSurvey = {
  blurSurvey: 0 | 1;
  setBlurSurvey: (value: 0 | 1) => void;
};

export const useBlurSurvey = create<ModalTimeSurvey>((set) => ({
  blurSurvey: 0,
  setBlurSurvey(value: 0 | 1) {
    set({ blurSurvey: value });
  },
}));

type DaysSurveySchema = {
  daysSurvey: number;
  setDaysSurvey: (value: number) => void;
};

export const useDaysSurvey = create<DaysSurveySchema>((set) => ({
  daysSurvey: 1,
  setDaysSurvey(value: number) {
    set({ daysSurvey: value });
  },
}));
