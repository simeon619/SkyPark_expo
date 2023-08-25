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

//////////////////////////////////////////////////////////////// renderind twice fix ********************************
type PostInSchema = {
  data: Set<string>;
  checkPostIdIn: (value: string) => boolean;
  clearPostIdIn: () => void;
};

export const usePostInSchema = create<PostInSchema>((set, get) => ({
  data: new Set(''),
  checkPostIdIn: (value) => {
    if (get().data.has(value)) return true;
    set((state) => ({ data: state.data.add(value) }));
    return false;
  },
  clearPostIdIn: () => {
    console.log('🚀 ~ file: postInSchema.ts:29 ~ usePostInSchema: ~ get.dataAVA', get().data);
    get().data.clear();
    console.log('🚀 ~ file: postInSchema.ts:29 ~ usePostInSchema: ~ get.dataAPR', get().data);
  },
}));

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
