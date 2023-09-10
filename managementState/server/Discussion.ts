import { generateTimestampUUID } from '../../Utilis/functions/generateUUID';
import { getDiscussionId, putMessageLocal, sendServer } from '../../Utilis/functions/utlisSquery';
import { MessageWithFileAndStatus } from '../../Utilis/models/Chat/messageReposotory';
import { FileType } from '../../lib/SQueryClient';
import { useTempMsgStore } from '../client/tempMessage';

export const sendMessage = async (data: { value?: string; accountId: string | undefined; files: FileType[] }) => {
  const { accountId, files, value } = data;

  if (!accountId) {
    console.error('Error sending message1:', data);
    return;
  }
  let discussionId = await getDiscussionId(accountId);
  if (!discussionId) return;
  let uuuid = generateTimestampUUID();
  let createMsg = Date.now();
  storeMessages(discussionId, [
    {
      Contenu_Message: value || null,
      ID_Conversation: discussionId,
      ID_Expediteur: accountId,
      ID_Message: uuuid,
      Date_Envoye: null,
      Date_Reçu: null,
      Date_Lu: null,
      files,
      Horodatage: createMsg,
    },
  ]);

  try {
    await putMessageLocal(files, value, discussionId, accountId, uuuid, createMsg);
    await sendServer(discussionId, accountId, uuuid, files, value);
  } catch (error) {
    console.error('Error sending message2:', error);
  }
};

const storeMessages = (discussionId: string, messsage: MessageWithFileAndStatus[]) => {
  useTempMsgStore.getState().setMsg({ [discussionId]: messsage });
};
