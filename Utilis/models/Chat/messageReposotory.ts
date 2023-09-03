import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase({ name: 'aq.db' });

export interface ConversationPrivateSchema {
  ID_Conversation: string;
  Type_Conversation: 'private';
  ID_DESTINATAIRE: string;
}

export interface ConversationGroupeSchema {
  ID_Conversation: string;
  Type_Conversation: 'group';
  ID_Groupe: string;
}

export const createPrivateConversation = async (conv: ConversationPrivateSchema) => {
  const { ID_Conversation, Type_Conversation, ID_DESTINATAIRE } = conv;

  db.transaction(async (tx) => {
    const query = `
      INSERT INTO Conversations (ID_Conversation, Type_Conversation, ID_DESTINATAIRE)
      VALUES (?, ?, ?)
    `;

    tx.executeSql(query, [ID_Conversation, Type_Conversation, ID_DESTINATAIRE], (_, result) => {
      if (result.rowsAffected > 0) {
        console.log('conv ajouté avec succès.');
      } else {
        console.log("Échec de l'ajout de l'conv.");
      }
    });
  });
};

export const createGroupConversation = async (conv: ConversationGroupeSchema) => {
  const { ID_Conversation, Type_Conversation, ID_Groupe } = conv;

  db.transaction(async (tx) => {
    const query = `
      INSERT INTO Conversations (ID_Conversation, Type_Conversation, ID_Groupe)
      VALUES (?, ?, ?)
    `;

    tx.executeSql(query, [ID_Conversation, Type_Conversation, ID_Groupe], (_, result) => {
      if (result.rowsAffected > 0) {
        console.log('conv ajouté avec succès.');
      } else {
        console.log("Échec de l'ajout de l'conv.");
      }
    });
  });
};

interface Message {
  ID_MESSAGE_SERVEUR?: string | null;
  ID_Conversation: string;
  ID_Expediteur: string;
  Contenu_Message: string | null;
  Horodatage: number;
}

interface StatutLecture {
  // ID_StatutLecture: string;
  ID_MESSAGE_SERVEUR?: string | null;
  ID_Message?: string | null;
  Date_Envoye?: number | null;
  Date_Reçu?: number | null;
  Date_Lu?: number | null;
}

interface File {
  url: string | null;
  size: number | null;
  extension: string | null;
}

// Créer un message avec statut de lecture et des fichiers
export async function createMessageWithStatusAndFiles(
  messageData: Message,
  statusData: StatutLecture,
  filesData: File[]
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO Messages ( ID_MESSAGE_SERVEUR, ID_Conversation, ID_Expediteur, Contenu_Message, Horodatage) VALUES (?, ?, ?, ?, ?)',
        [
          messageData.ID_MESSAGE_SERVEUR || null,
          messageData.ID_Conversation,
          messageData.ID_Expediteur,
          messageData.Contenu_Message,
          messageData.Horodatage,
        ],
        (_, results) => {
          if (results.rowsAffected > 0) {
            console.log(
              '🚀 ~ file: messageReposotory.ts:103 ~ db.transaction ~ results.rows.item(0):',
              results.rows.item(0)
            );
            // const MessageId = results.rows.item(0).ID_Message;
            tx.executeSql(
              'INSERT INTO StatutLecture ( Date_Envoye, Date_Reçu, Date_Lu) VALUES ( ?, ?, ?)',
              [statusData.Date_Envoye || null, statusData.Date_Reçu || null, statusData.Date_Lu || null],
              (_, results) => {
                if (results.rowsAffected > 0) {
                  const fileInsertPromises = filesData.map((file) => {
                    return new Promise<void>((resolveFile, rejectFile) => {
                      const MessageId = results.rows.item(0).ID_Message;

                      tx.executeSql(
                        'INSERT INTO Files (ID_Message, URL, Size, Extension) VALUES (?, ?, ?, ?)',
                        [MessageId, file.url, file.size, file.extension],
                        (_, results) => {
                          if (results.rowsAffected > 0) {
                            resolveFile();
                          } else {
                            rejectFile(new Error("Erreur lors de l'insertion du fichier."));
                          }
                        },
                        (_, error) => {
                          rejectFile(error);
                          return true;
                        }
                      );
                    });
                  });

                  // Attendez que toutes les insertions de fichiers soient terminées
                  Promise.all(fileInsertPromises)
                    .then(() => {
                      resolve();
                    })
                    .catch((error) => {
                      reject(error);
                    });
                } else {
                  reject(new Error("Erreur lors de l'insertion du statut de lecture."));
                }
              },
              (_, error) => {
                reject(error);
                return true;
              }
            );
          } else {
            reject(new Error("Erreur lors de l'insertion du message."));
          }
        },
        (_, error) => {
          reject(error);
          return true;
        }
      );
    });
  });
}

export async function addStatutMessage(statutLecture: StatutLecture): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        // 'UPDATE StatutLecture (ID_MESSAGE_SERVEUR, Date_Envoye, Date_Reçu, Date_Lu) VALUES (?, ?, ?, ?)',
        [
          statutLecture.ID_MESSAGE_SERVEUR,
          statutLecture.Date_Envoye || null,
          statutLecture.Date_Reçu || null,
          statutLecture.Date_Lu || null,
        ],
        (_, results) => {
          if (results.rowsAffected > 0) {
            resolve();
          } else {
            reject(new Error("Erreur lors de l'insertion du statut de lecture."));
          }
        },
        (_, error) => {
          reject(error);
          return true;
        }
      );
    });
  });
}

export type MessageWithFileAndStatus = {
  files: FileSchema[];
  Contenu_Message: string;
  ID_Expediteur: string;
  Horodatage: number;
  ID_Conversation: string;
  Date_Envoye: number | null;
  Date_Reçu: number | null;
  Date_Lu: number | null;
};

export const getMessages = async (
  page: number,
  itemsPerPage: number,
  dicussionId: string
): Promise<MessageWithFileAndStatus[]> => {
  return new Promise((resolve, reject) => {
    const offset = (page - 1) * itemsPerPage;

    const query = `
      SELECT 
         Messages.ID_Message AS ID_Message,
        Messages.ID_Conversation AS ID_Conversation,
        Messages.Contenu_Message AS Contenu_Message,
        Messages.ID_Expediteur AS ID_Expediteur,
        StatutLecture.Date_Envoye AS Date_Envoye,
        StatutLecture.Date_Reçu AS Date_Reçu,
        StatutLecture.Date_Lu AS Date_Lu
      FROM Messages
      INNER JOIN StatutLecture ON Messages.ID_Message = StatutLecture.ID_Message
      WHERE Messages.ID_Conversation = ?
      ORDER BY Messages.ID_Message DESC
      LIMIT ? OFFSET ?
    `;

    db.transaction((tx) => {
      tx.executeSql(
        query,
        [dicussionId, itemsPerPage, offset],
        async (_, { rows }) => {
          let files = await getFilesForMessage(rows.item(0).ID_Message);

          const messagesWithFilesAndStatus: MessageWithFileAndStatus[] = rows.raw();
          let result = messagesWithFilesAndStatus.map((message) => {
            return {
              ...message,
              files,
            };
          });
          resolve(result);
        },
        (error) => {
          reject(error);
          return true;
        }
      );
    });
  });
};
export type FileSchema = {
  _id: number;
  url: string;
  size: number;
  extension: string;
  type: string;
  fileName: string;
  encoding:
    | 'binary'
    | 'base64'
    | 'ascii'
    | 'hex'
    | 'base64url'
    | 'latin1'
    | 'ucs-2'
    | 'ucs2'
    | 'utf-8'
    | 'utf16le'
    | 'utf8';
  buffer: Uint8Array;
};

export const getFilesForMessage = (messageId: string): Promise<FileSchema[]> => {
  const query = `
    SELECT 
      Files.*
    FROM Files
    WHERE Files.ID_Message = ?
  `;

  return new Promise((resolve) => {
    db.transaction((tx) => {
      tx.executeSql(query, [messageId], (_, result) => {
        if (result.rows.length > 0) {
          const filesForMessage: FileSchema[] = [];

          for (let i = 0; i < result.rows.length; i++) {
            filesForMessage.push(result.rows.item(i));
          }
          resolve(filesForMessage);
        } else {
          resolve([]);
        }
      });
    });
  });
};

export const getMessagesWithNullDateEnvoye = async (): Promise<MessageWithFileAndStatus[]> => {
  return new Promise((resolve, reject) => {
    const query = `
    SELECT 
    Messages.ID_Message AS ID_Message,
   Messages.Contenu_Message AS Contenu_Message,
   Messages.ID_Conversation AS ID_Conversation,
   Messages.ID_Expediteur AS ID_Expediteur,
   StatutLecture.Date_Envoye AS Date_Envoye,
   StatutLecture.Date_Reçu AS Date_Reçu,
   StatutLecture.Date_Lu AS Date_Lu
 FROM Messages
 INNER JOIN StatutLecture ON Messages.ID_Message = StatutLecture.ID_Message
 WHERE StatutLecture.Date_Envoye IS NULL
 ORDER BY Messages.ID_Message ASC
    `;

    db.transaction((tx) => {
      tx.executeSql(
        query,
        [],
        async (_, { rows }) => {
          let files = await getFilesForMessage(rows.item(0).ID_Message);

          const messagesWithFilesAndStatus: MessageWithFileAndStatus[] = rows.raw();
          let result = messagesWithFilesAndStatus.map((message) => {
            return {
              ...message,
              files,
            };
          });
          resolve(result);
        },
        (error) => {
          reject(error);
          return true;
        }
      );
    });
  });
};

// const