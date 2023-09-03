import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase({ name: 'aq.db' });

export interface UserSchema {
  ID_Utilisateur: string;
  ID_Conversation?: string;
  Nom_Utilisateur: string;
  Url_Pic?: string;
  Last_Seen: number;
}

export const addUser = (newUser: UserSchema) => {
  const { ID_Utilisateur, Nom_Utilisateur, Url_Pic, Last_Seen } = newUser;
  console.log('🚀 ~ file: userRepository.ts:16 ~ addUser ~ { ID_Utilisateur, Nom_Utilisateur, Url_Pic, Last_Seen } :', {
    ID_Utilisateur,
    Nom_Utilisateur,
    Url_Pic,
    Last_Seen,
  });

  db.transaction((tx) => {
    const query = `
    INSERT INTO Utilisateurs (ID_Utilisateur, Nom_Utilisateur, Url_Pic, Last_Seen)
    VALUES ('${ID_Utilisateur}', '${Nom_Utilisateur}', ${Url_Pic ? `'${Url_Pic}'` : 'null'}, ${Last_Seen})
  `;

    tx.executeSql(
      query,
      [],
      (_, result) => {
        if (result.rowsAffected > 0) {
          console.log('Utilisateur ajouté avec succès.', result.rows.item(0));
        } else {
          console.log("Échec de l'ajout de l'utilisateur.");
        }
      },
      (_, error) => {
        console.log("Erreur lors de l'ajout de l'utilisateur :", error);

        return false;
      }
    );
  });
};

export const readUser = (userID: string): Promise<UserSchema | null> => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      const query = `SELECT * FROM Utilisateurs WHERE ID_Utilisateur = ?`;

      tx.executeSql(query, [userID], (_, result) => {
        if (result.rows.length > 0) {
          console.log('🚀 ~ file: userRepository.ts:55 ~ tx.executeSql ~ result.rows.item(0):', result.rows.item(0));
          resolve(result.rows.item(0));
        } else {
          resolve(null);
        }
      });
    });
  });
};

export const getAllUsers = (pageNumber: number, itemsPerPage: number): Promise<UserSchema[]> => {
  const offset = pageNumber * itemsPerPage;
  const query = `SELECT 
  Utilisateurs.*,
   Conversations.ID_Conversation AS ID_Conversation 
   FROM Utilisateurs
    LEFT JOIN Conversations ON Utilisateurs.ID_Utilisateur = Conversations.ID_DESTINATAIRE
    LIMIT ? OFFSET ?`;

  return new Promise((resolve) => {
    db.transaction((tx) => {
      tx.executeSql(query, [itemsPerPage, offset], (_, result) => {
        if (result.rows.length > 0) {
          const users: UserSchema[] = [];

          for (let i = 0; i < result.rows.length; i++) {
            users.push(result.rows.item(i));
          }
          resolve(users);
        } else {
          resolve([]);
        }
      });
    });
  });
};

// let u = await readUser("")
