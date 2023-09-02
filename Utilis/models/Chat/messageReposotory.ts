import * as SQLite from 'expo-sqlite';
import { DB_NAME } from '../../../constants/Value';

const db = SQLite.openDatabase(DB_NAME);

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

  db.transactionAsync(async (tx) => {
    const query = `
      INSERT INTO Conversations (ID_Conversation, Type_Conversation, ID_DESTINATAIRE)
      VALUES (?, ?, ?)
    `;

    let result = await tx.executeSqlAsync(query, [ID_Conversation, Type_Conversation, ID_DESTINATAIRE]);
    //@ts-ignore
    if (result?.error) {
      //@ts-ignore
      console.log("Erreur lors de l'ajout de l'conv :", result?.error);
      //@ts-ignore
      throw new Error(result?.error);
    }
    //@ts-ignore
    if (result.rowsAffected > 0) {
      console.log('conv ajouté avec succès.');
    } else {
      console.log("Échec de l'ajout de l'conv.");
    }
  });
};

export const createGroupConversation = async (conv: ConversationGroupeSchema) => {
  const { ID_Conversation, Type_Conversation, ID_Groupe } = conv;

  db.transactionAsync(async (tx) => {
    const query = `
      INSERT INTO Conversations (ID_Conversation, Type_Conversation, ID_Groupe)
      VALUES (?, ?, ?)
    `;

    let result = await tx.executeSqlAsync(query, [ID_Conversation, Type_Conversation, ID_Groupe]);
    //@ts-ignore
    if (result?.error) {
      //@ts-ignore
      console.log("Erreur lors de l'ajout de l'conv :", result?.error);
      //@ts-ignore
      throw new Error(result?.error);
    }
    //@ts-ignore
    if (result.rowsAffected > 0) {
      console.log('conv ajouté avec succès.');
    } else {
      console.log("Échec de l'ajout de l'conv.");
    }
  });
};

interface Message {
  ID_Message: string;
  ID_MESSAGE_SERVEUR: string | null;
  ID_Conversation: string;
  ID_Expediteur: string;
  Contenu_Message: string;
  Horodatage: number;
}

interface StatutLecture {
  ID_StatutLecture: string;
  ID_Message: string;
  Date_Envoye: number | null;
  Date_Reçu: number | null;
  Date_Lu: number | null;
}

interface File {
  _id: string;
  ID_Message: string;
  URL: string | null;
  Size: number | null;
  Extension: string | null;
}

// Créer un message avec statut de lecture et des fichiers
async function createMessageWithStatusAndFiles(
  messageData: Message,
  statusData: StatutLecture,
  filesData: File[]
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO Messages (ID_Message, ID_MESSAGE_SERVEUR, ID_Conversation, ID_Expediteur, Contenu_Message, Horodatage) VALUES (?, ?, ?, ?, ?, ?)',
        [
          messageData.ID_Message,
          messageData.ID_MESSAGE_SERVEUR,
          messageData.ID_Conversation,
          messageData.ID_Expediteur,
          messageData.Contenu_Message,
          messageData.Horodatage,
        ],
        (_, results) => {
          if (results.rowsAffected > 0) {
            tx.executeSql(
              'INSERT INTO StatutLecture (ID_StatutLecture, ID_Message, Date_Envoye, Date_Reçu, Date_Lu) VALUES (?, ?, ?, ?, ?)',
              [
                statusData.ID_StatutLecture,
                statusData.ID_Message,
                statusData.Date_Envoye,
                statusData.Date_Reçu,
                statusData.Date_Lu,
              ],
              (_, results) => {
                if (results.rowsAffected > 0) {
                  // Insertion du statut de lecture réussie, maintenant insérer les fichiers
                  const fileInsertPromises = filesData.map((file) => {
                    return new Promise<void>((resolveFile, rejectFile) => {
                      tx.executeSql(
                        'INSERT INTO Files (_id, ID_Message, URL, Size, Extension) VALUES (?, ?, ?, ?, ?)',
                        [file._id, file.ID_Message, file.URL, file.Size, file.Extension],
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

// Exemple d'utilisation de la fonction
const messageData: Message = {
  ID_Message: '1',
  ID_MESSAGE_SERVEUR: 'server-1',
  ID_Conversation: 'conversation-1',
  ID_Expediteur: 'user-1',
  Contenu_Message: 'Ceci est un exemple de message.',
  Horodatage: Date.now(),
};

const statusData: StatutLecture = {
  ID_StatutLecture: 'status-1',
  ID_Message: '1',
  Date_Envoye: null,
  Date_Reçu: null,
  Date_Lu: null,
};

const filesData: File[] = [
  {
    _id: 'file-1',
    ID_Message: '1',
    URL: 'https://example.com/file1',
    Size: 1024,
    Extension: 'jpg',
  },
  {
    _id: 'file-2',
    ID_Message: '1',
    URL: 'https://example.com/file2',
    Size: 2048,
    Extension: 'pdf',
  },
];

createMessageWithStatusAndFiles(messageData, statusData, filesData)
  .then(() => {
    console.log('Message, statut de lecture et fichiers insérés avec succès.');
  })
  .catch((error) => {
    console.error("Erreur lors de l'insertion :", error);
  });
