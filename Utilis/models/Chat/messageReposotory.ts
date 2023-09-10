import { db } from './database';

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
  // const { ID_Conversation, Type_Conversation, ID_DESTINATAIRE } = conv;
  db.transaction((tx) => {
    const query = `
      INSERT INTO Conversations (ID_Conversation, Type_Conversation, ID_DESTINATAIRE, ID_Groupe)
      VALUES (?, ?, ?, ?)
    `;

    tx.executeSql(
      query,
      [conv.ID_Conversation, conv.Type_Conversation, conv.ID_DESTINATAIRE, null], // Les valeurs sont passées en tant que tableau de paramètres
      (_, result) => {
        if (result.rowsAffected > 0) {
          console.log('conv ajouté avec succès.');
        } else {
          console.log("Échec de l'ajout de l'conv.");
        }
      },
      (_, error) => {
        console.log("Erreur lors de l'ajout de conv. " + conv.ID_Conversation, error);
      }
    );
  });
};

export const createGroupConversation = async (conv: ConversationGroupeSchema) => {
  const { ID_Conversation, Type_Conversation, ID_Groupe } = conv;

  db.transaction(async (tx) => {
    const query = `
      INSERT INTO Conversations (ID_Conversation, Type_Conversation, ID_DESTINATAIRE, ID_Groupe)
      VALUES (?, ?, ?, ?)
    `;

    tx.executeSql(query, [ID_Conversation, Type_Conversation, null, ID_Groupe], (_, result) => {
      if (result.rowsAffected > 0) {
        console.log('conv ajouté avec succès.');
      } else {
        console.log("Échec de l'ajout de l'conv.");
      }
    });
  });
};

interface Message {
  ID_Message: string;
  ID_Conversation: string;
  ID_Expediteur: string;
  Contenu_Message: string | null;
  Horodatage: number;
}

interface StatutLecture {
  // ID_StatutLecture: string;
  ID_Message?: string | null;
  Date_Envoye?: number | null;
  Date_Reçu?: number | null;
  Date_Lu?: number | null;
}

export type FileServer = {
  url: string;
  size: number;
  extension: string;
  uri: string;
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
  buffer: string | Buffer | ArrayBuffer;
};

type FileType = Partial<FileServer>;
const addMessage = (messageData: Message) => {
  return new Promise<number>((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `INSERT INTO Messages (ID_Message, ID_Conversation, ID_Expediteur, Contenu_Message, Horodatage) VALUES (?, ?, ?, ?, ?)`,
        [
          messageData.ID_Message,
          messageData.ID_Conversation,
          messageData.ID_Expediteur,
          messageData.Contenu_Message,
          messageData.Horodatage,
        ],
        (_, result) => {
          if (result.rowsAffected > 0) {
            resolve(1);
          } else {
            reject('error addMessage');
          }
        },
        (error) => {
          console.error('Error adding message:', error);
          reject(error);
        }
      );
    });
  });
};

const addStatutLecture = (messageData: Message, statusData: StatutLecture) => {
  return new Promise<number>((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO StatutLecture (ID_Message, Date_Envoye, Date_Reçu, Date_Lu) VALUES (?, ?, ?, ?)',
        [
          messageData.ID_Message,
          statusData.Date_Envoye || null,
          statusData.Date_Reçu || null,
          statusData.Date_Lu || null,
        ],
        (_, result) => {
          console.log(result.rows.item(0), 'addStatutLecture');
          if (result.rowsAffected > 0) {
            resolve(1);
          } else {
            reject('error addMessage');
          }
        },
        (error) => {
          console.error('Error adding status:', error);
          reject(error);
        }
      );
    });
  });
};

const addFiles = (messageData: Message, filesData: FileType[]) => {
  return new Promise<number>((resolve, reject) => {
    db.transaction((tx) => {
      const promises = filesData.map((file) => {
        return new Promise<number>((resolveFile, rejectFile) => {
          tx.executeSql(
            'INSERT INTO Files (ID_Message, url, uri, size, extension, fileName, encoding, type, buffer) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
              messageData.ID_Message,
              file.url,
              file.uri,
              file.size,
              file.extension,
              file.fileName,
              file.encoding,
              file.type,
              file.buffer,
            ],
            (_, results) => {
              if (results.rowsAffected > 0) {
                resolveFile(1);
              } else {
                rejectFile(new Error('Error adding file'));
              }
            },
            (_, error) => {
              console.error('Error adding file:', error);
              rejectFile(error);
            }
          );
        });
      });

      Promise.all(promises)
        .then(() => {
          resolve(1);
        })
        .catch((error) => {
          reject(error);
        });
    });
  });
};
// Créer un message avec statut de lecture et des fichiersexport async function createMessageWithStatusAndFiles(
export async function createMessageWithStatusAndFiles(
  messageData: Message,
  statusData: StatutLecture,
  filesData: FileType[]
): Promise<void> {
  console.log('createMessageWithStatusAndFiles');

  try {
    await addMessage(messageData);
    await addFiles(messageData, filesData);
    await addStatutLecture(messageData, statusData);
    console.log('OPERATION REUSSIE');
  } catch (error) {
    console.error('Error creating message with status and files:', error);
  }
}
export function getConversationIdByDestinataire(destinataireId: string): Promise<string | null> {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM Conversations WHERE ID_DESTINATAIRE = ?',
        [destinataireId],
        (_, results) => {
          if (results.rows.length > 0) {
            const conversationId = results.rows.item(0).ID_Conversation;
            resolve(conversationId);
          } else {
            resolve(null);
          }
        },
        (_, error) => {
          console.error('Error getting conversation id:', error);
          reject(error);
        }
      );
    });
  });
}

export async function updateStatutMessage(statutLecture: StatutLecture): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `UPDATE StatutLecture 
        SET Date_Envoye = ?, 
        Date_Reçu = ?, 
        Date_Lu = ? 
        WHERE ID_Message = ?`,
        [
          statutLecture.Date_Envoye || null,
          statutLecture.Date_Reçu || null,
          statutLecture.Date_Lu || null,
          statutLecture.ID_Message,
        ],
        (_, results) => {
          if (results.rowsAffected > 0) {
            resolve();
          } else {
            reject(new Error('Erreur lors de la mise à jour du statut de lecture.'));
          }
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
}

export type MessageWithFileAndStatus = {
  files: FileType[];
  Contenu_Message: string | null;
  ID_Message: string;
  ID_Expediteur: string;
  Horodatage: number;
  ID_Conversation: string;
  Date_Envoye: number | null;
  Date_Reçu: number | null;
  Date_Lu: number | null;
};

// export const getMes = async (): Promise<MessageWithFileAndStatus[]> => {
//   return new Promise((resolve, reject) => {
//     const query = `
//       SELECT
//          Messages.*,
//         StatutLecture.*
//       FROM Messages
//       INNER JOIN StatutLecture ON Messages.ID_Message = StatutLecture.ID_Message
//       ORDER BY Messages.Horodatage ASC
//     `;

//     db.transaction((tx) => {
//       tx.executeSql(query, [], async (_, { rows }) => {
//         let files = await getFilesForMessage(rows.item(0)?.ID_Message);
//       });
//     });
//   });
// };
export const getMessages = async (
  page: number,
  itemsPerPage: number,
  dicussionId: string | null | undefined
): Promise<MessageWithFileAndStatus[]> => {
  // if(!dicussionId) return Promise<[]>;
  return new Promise((resolve, reject) => {
    const offset = (page - 1) * itemsPerPage;
    const query = `
      SELECT 
      Messages.*,
      StatutLecture.*
      FROM Messages
      INNER JOIN StatutLecture ON Messages.ID_Message = StatutLecture.ID_Message
      WHERE Messages.ID_Conversation = ?
      ORDER BY Messages.Horodatage DESC
      LIMIT ? OFFSET ?
    `;

    db.transaction((tx) => {
      tx.executeSql(
        query,
        [dicussionId, itemsPerPage, offset],
        async (_, { rows }) => {
          const messagesWithFilesAndStatus: MessageWithFileAndStatus[] = rows.raw();

          let messagesPromise = messagesWithFilesAndStatus.map(async (message) => {
            let files = await getFilesForMessage(message.ID_Message);
            return {
              ...message,
              files,
            };
          });

          let messages = await Promise.all(messagesPromise);
          resolve(messages);
        },
        (error) => {
          reject(error);
        }
      );
    });
  });
};

export const getMessagesWithNullDateEnvoye = () => {
  const query = `
    SELECT 
      Messages.*,
      StatutLecture.*
    FROM Messages
    LEFT JOIN StatutLecture ON Messages.ID_Message = StatutLecture.ID_Message
    WHERE StatutLecture.Date_Envoye IS NULL
    ORDER BY Messages.Horodatage ASC
  `;

  return new Promise<MessageWithFileAndStatus[]>((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        query,
        [],
        (_, { rows }) => {
          const messagesWithFilesAndStatus: MessageWithFileAndStatus[] = rows.raw();
          Promise.all(
            messagesWithFilesAndStatus.map(async (message) => {
              const files = await getFilesForMessage(message.ID_Message);
              return {
                ...message,
                files,
              };
            })
          )
            .then((result) => {
              resolve(result);
            })
            .catch((error) => {
              reject(error);
            });
        },
        (error) => {
          reject(error);
        }
      );
    });
  });
};

export const getFilesForMessage = (messageId: string): Promise<FileType[]> => {
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
          const filesForMessage: FileType[] = [];

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

// const
