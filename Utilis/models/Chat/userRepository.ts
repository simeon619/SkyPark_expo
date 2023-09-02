import * as SQLite from 'expo-sqlite';
import { DB_NAME } from '../../../constants/Value';

const db = SQLite.openDatabase(DB_NAME);

export interface UserSchema {
  ID_Utilisateur: string;
  Nom_Utilisateur: string;
  Url_Pic?: string;
  Last_Seen: string;
}

export const addUser = (newUser: UserSchema) => {
  const { ID_Utilisateur, Nom_Utilisateur, Url_Pic, Last_Seen } = newUser;

  db.transaction((tx) => {
    const query = `
      INSERT INTO Utilisateurs (ID_Utilisateur, Nom_Utilisateur, Url_Pic, Last_Seen)
      VALUES (?, ?, ?, ?)
    `;

    tx.executeSql(
      query,
      [ID_Utilisateur, Nom_Utilisateur, Url_Pic || null, Last_Seen],
      (_, result) => {
        if (result.rowsAffected > 0) {
          console.log('Utilisateur ajouté avec succès.');
        } else {
          console.log("Échec de l'ajout de l'utilisateur.");
        }
      },
      (_, error) => {
        console.log("Erreur lors de l'ajout de l'utilisateur :", error);

        return true;
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
  const query = `SELECT * FROM Utilisateurs LIMIT ${itemsPerPage} OFFSET ${offset}`;

  return new Promise((resolve) => {
    db.transaction((tx) => {
      tx.executeSql(query, [], (_, result) => {
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
