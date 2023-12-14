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
      newMessage: {
        idMessage: uuuid,
        contenuMessage: value || null,
        horodatage: createMsg,
        idConversation: discussionId,
        idExpediteur: accountId,
      },
      statusData: {
        dateEnvoye: null,
        dateReçu: null,
        dateLu: null,
        idMessage: uuuid,
        idStatutLecture: 1,
      },
      filesData: files.map((file) => ({
        ...file,
        extension: file.type.split('/')[1],
        uri: file.uri,
        url: null,
        buffer: null,
      })),
    },
  ]);

  try {
    await putMessageLocal(files, value || null, discussionId, accountId, uuuid, createMsg);
    await sendServer(discussionId, accountId, uuuid, files, value);
  } catch (error) {
    console.error('Error sending message2:', error);
  }
};

const storeMessages = (discussionId: string, messsage: MessageWithFileAndStatus[]) => {
  useTempMsgStore.getState().setMsg({ [discussionId]: messsage });
};
