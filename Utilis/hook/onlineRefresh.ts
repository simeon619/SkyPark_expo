import NetInfo from '@react-native-community/netinfo';
import { sendServer } from '../functions/utlisSquery';
import { getMessagesWithNullDateEnvoye } from '../models/Chat/messageReposotory';

NetInfo.addEventListener((state) => {
  if (state.isConnected) {
    const sendMessagesNotSent = async () => {
      try {
        const messages = await getMessagesWithNullDateEnvoye();

        for (const message of messages) {
          try {
            //@ts-ignore
            await sendServer(message.ID_Conversation, message.ID_Expediteur, message.ID_Message, message.files);
          } catch (error) {
            console.error("Erreur lors de l'envoi du message:", error);
          }
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des messages non envoyés:', error);
      }
    };

    sendMessagesNotSent();
  }
});
