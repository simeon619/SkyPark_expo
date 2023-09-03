import NetInfo from '@react-native-community/netinfo';
import { getMessagesWithNullDateEnvoye } from '../models/Chat/messageReposotory';

NetInfo.addEventListener((state) => {
  if (state.isConnected) {
    const sendMesssageNotSend = async () => {
      let messages = await getMessagesWithNullDateEnvoye();

      messages.forEach(async (message) => {
        // sendServer()
      });
    };

    sendMesssageNotSend();
  }
});
