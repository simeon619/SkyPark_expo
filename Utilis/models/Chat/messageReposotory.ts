import { Conversation, File, Message, StatutLecture, getContentFile, saveContentFile } from './database';

export const createConversation = async (conv: Conversation) => {
  let FileConv = await getContentFile('Conversation');
  let convs: Conversation[] = JSON.parse(FileConv);
  let convExist = convs.find((c) => c.idConversation === conv.idConversation);

  if (!convExist) {
    convs.push(conv);
    saveContentFile('Conversation', JSON.stringify(convs));
    // console.log('conv ajouté avec succès.');
  } else {
    console.log("Échec de l'ajout de l'conv.");
  }
};

// interface Message {
//   ID_Message: string;
//   ID_Conversation: string;
//   ID_Expediteur: string;
//   Contenu_Message: string | null;
//   Horodatage: number;
// }

// interface StatutLecture {
//   // ID_StatutLecture: string;
//   ID_Message?: string | null;
//   Date_Envoye?: number | null;
//   Date_Reçu?: number | null;
//   Date_Lu?: number | null;
// }

// export type MessageWithFileAndStatus = {
//   files: FileType[];
//   Contenu_Message: string | null;
//   ID_Message: string;
//   ID_Expediteur: string;
//   Horodatage: number;
//   ID_Conversation: string;
//   Date_Envoye: number | null;
//   Date_Reçu: number | null;
//   Date_Lu: number | null;
// };
export type MessageWithFileAndStatus = { newMessage: Message; statusData: StatutLecture; filesData: File[] };

export const createMessage = async (data: MessageWithFileAndStatus) => {
  const { newMessage } = data;
  let FileMessages = await getContentFile('Message');
  let messages: Record<string, MessageWithFileAndStatus[]> = JSON.parse(FileMessages);

  if (!messages[newMessage.idConversation]) {
    messages[newMessage.idConversation] = [];
  }
  messages[newMessage.idConversation].push(data);

  saveContentFile('Message', JSON.stringify(messages));
};

export async function getConversationIdByDestinataire(destinataireId: string): Promise<string | null> {
  const Conversation = await getContentFile('Conversation');

  let convs: Conversation[] = JSON.parse(Conversation);

  let conversation = convs.find((c) => c.idDestinataire === destinataireId);

  return conversation?.idConversation || null;
}

export async function updateStatutMessage(
  statutLecture: Partial<StatutLecture>,
  idConversation: string
): Promise<void> {
  const FileMessage = await getContentFile('Message');

  let messages: Record<string, MessageWithFileAndStatus[]> = JSON.parse(FileMessage);

  const index = messages[idConversation].findIndex((m) => m.newMessage.idMessage === statutLecture.idMessage);

  if (index !== -1) {
    messages[idConversation][index].statusData = {
      dateEnvoye: statutLecture?.dateEnvoye || null,
      dateLu: statutLecture?.dateLu || null,
      dateReçu: statutLecture?.dateReçu || null,
      idStatutLecture: statutLecture?.idStatutLecture || 1,
      idMessage: statutLecture?.idMessage || '',
    };
    saveContentFile('Message', JSON.stringify(messages));
  }
}

export const getMessages = async (page: number, itemsPerPage: number, dicussionId: string) => {
  const FileMessages = await getContentFile('Message');

  let messages: Record<string, MessageWithFileAndStatus[]> = JSON.parse(FileMessages);

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return messages[dicussionId]?.slice(startIndex, endIndex) || [];
};

export const getMessagesWithNullDateEnvoye = async () => {
  const FileMessages = await getContentFile('Message');

  let messages: Record<string, MessageWithFileAndStatus[]> = JSON.parse(FileMessages);
  let listMessage: MessageWithFileAndStatus[] = [];

  Object.keys(messages).forEach((key) => {
    listMessage = messages[key].filter((message) => message.statusData.dateEnvoye === null);
  });

  return listMessage;
};
