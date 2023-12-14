import AsyncStorage from '@react-native-async-storage/async-storage';

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { MessageWithFileAndStatus } from '../../Utilis/models/Chat/messageReposotory';

type tempMsgState = {
  messages: Record<string, Record<string, MessageWithFileAndStatus>> | null;
  isClear: boolean;
};
type tmpMsgAction = {
  setMsg: (value: Record<string, MessageWithFileAndStatus[]>) => void;
  removeMsg: () => void;
};

type StateSchema = tmpMsgAction & tempMsgState;
export const useTempMsgStore = create<StateSchema, any>(
  persist(
    (set) => ({
      messages: {},
      isClear: false,

      setMsg: (value) => {
        set((state) => {
          const newState = { ...state };
          const [discId] = Object.keys(value);
          const incomingMessages = value[discId];
          const existingMessages = newState.messages?.[discId] || {};
          incomingMessages.forEach((message) => {
            existingMessages[message.newMessage.idMessage] = message;
          });
          newState.messages = { [discId]: existingMessages };
          newState.isClear = true;
          return newState;
        });
      },
      removeMsg: () => {
        set({
          messages: {},
          isClear: false,
        });
      },
    }),
    {
      name: 'tmpMsg',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Record<string, MessageWithFileAndStatus>,
