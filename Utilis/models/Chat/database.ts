import * as SQLite from 'expo-sqlite';

export async function openDatabase(pathToDatabaseFile: string): Promise<SQLite.SQLiteDatabase> {
  return SQLite.openDatabase(pathToDatabaseFile);
}

export const createTable = async (db: SQLite.SQLiteDatabase) => {
  await db.execAsync([{ sql: 'PRAGMA foreign_keys = ON;', args: [] }], false);

  // db.exec([{ sql: 'PRAGMA foreign_keys = ON;', args: [] }], false, () => console.log('Foreign keys turned on'));

  db.transaction((tx) => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS Utilisateurs (
             ID_Utilisateur VARCHAR(24) PRIMARY KEY,
             Nom_Utilisateur TEXT NOT NULL,
             Url_Pic TEXT,
             Last_Seen DATETIME NOT NULL
           )`
    );

    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS Groupes (
             ID_Groupe VARCHAR(24) PRIMARY KEY,
             Nom_Groupe VARCHAR(250) NOT NULL
           )`
    );

    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS Conversations (
             ID_Conversation VARCHAR(24) PRIMARY KEY,
             Type_Conversation VARCHAR(24) NOT NULL,
             ID_DESTINATAIRE VARCHAR(24),
             ID_Groupe VARCHAR(24) 
           )`
    );
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS ParticipantsAuGroupe (
             ID_Utilisateur VARCHAR(24),
             ID_Groupe VARCHAR(24)
           )`
    );
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS Files (
             _id INTEGER PRIMARY KEY AUTOINCREMENT ,
             ID_Message VARCHAR(24) NOT NULL,
             URL TEXT ,
             Size INTEGER,
             Extension TEXT
           )`
    );

    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS Messages (
             ID_Message INTEGER PRIMARY KEY AUTOINCREMENT,
             ID_MESSAGE_SERVEUR VARCHAR(24),
             ID_Conversation VARCHAR(24) NOT NULL,
             ID_Expediteur VARCHAR(24),
             Contenu_Message TEXT ,
             Horodatage INTEGER NOT NULL,
           )`
    );

    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS StatutLecture (
             ID_StatutLecture INTEGER PRIMARY KEY AUTOINCREMENT,
             ID_Message VARCHAR(24) NOT NULL,
             Date_Envoye INTEGER ,
             Date_Reçu INTEGER ,
             Date_Lu INTEGER 
           )`
    );
  });

  // Ajouter les contraintes de clé étrangère
  db.transaction((tx) => {
    tx.executeSql(
      `ALTER TABLE Files
           ADD FOREIGN KEY (ID_Message) REFERENCES Messages (ID_Message)`
    );

    tx.executeSql(
      `ALTER TABLE Messages
           ADD FOREIGN KEY (ID_Conversation) REFERENCES Conversations (ID_Conversation),
           ADD FOREIGN KEY (ID_Expediteur) REFERENCES Utilisateurs (ID_Utilisateur),`
    );

    tx.executeSql(
      `ALTER TABLE Conversations
           ADD FOREIGN KEY (ID_DESTINATAIRE) REFERENCES Utilisateurs (ID_Utilisateur),
           ADD FOREIGN KEY (ID_Groupe) REFERENCES Groupes (ID_Groupe)`
    );

    tx.executeSql(
      `ALTER TABLE ParticipantsAuGroupe
           ADD FOREIGN KEY (ID_Utilisateur) REFERENCES Utilisateurs (ID_Utilisateur),
           ADD FOREIGN KEY (ID_Groupe) REFERENCES Groupes (ID_Groupe)`
    );

    tx.executeSql(
      `ALTER TABLE StatutLecture
           ADD FOREIGN KEY (ID_Message) REFERENCES Messages (ID_Message)`
    );

    tx.executeSql(`CREATE INDEX idx_conversation_id ON Messages (ID_Conversation)`);

    tx.executeSql(`CREATE INDEX idx_messages_id ON Messages (ID_Message)`);
    tx.executeSql(`CREATE INDEX idx_StatutLecture_id ON StatutLecture (ID_Message)`);
    tx.executeSql(`CREATE INDEX idx_Files_id ON Files (ID_Message)`);
  });
  //verifiez si toutes les tables on ete cree
  db.transaction((tx) => {
    tx.executeSql(`SELECT name FROM sqlite_master WHERE type='table';`, [], (_, result) => {
      for (let i = 0; i < result.rows.length; i++) {
        console.log('Table name:', result.rows.item(i).name);
      }
    });
  });
};

export const dropAllTables = (db: SQLite.SQLiteDatabase) => {
  db.transaction((tx) => {
    tx.executeSql(`SELECT name FROM sqlite_master WHERE type='table';`, [], (_, result) => {
      for (let i = 0; i < result.rows.length; i++) {
        tx.executeSql(`DROP TABLE IF EXISTS ${result.rows.item(i).name};`);
        console.log(`Table ${result.rows.item(i).name} supprimée.`);
      }
    });
  });
};
