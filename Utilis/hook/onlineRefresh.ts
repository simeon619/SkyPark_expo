import NetInfo from '@react-native-community/netinfo';
import { sendServer } from '../functions/utlisSquery';
import { getMessagesWithNullDateEnvoye } from '../models/Chat/messageReposotory';

NetInfo.addEventListener((state) => {
  if (state.isConnected) {
    const sendMesssageNotSend = async () => {
      let messages = await getMessagesWithNullDateEnvoye();

      messages.forEach(async (message) => {
        sendServer(message.ID_Conversation, message.ID_Expediteur, message.files, message.Contenu_Message);
      });
    };

    // sendMesssageNotSend();
  }
});
