import SQLite from 'react-native-sqlite-storage';

export const db = SQLite.openDatabase({ name: 'three.db', location: 'Documents' });

export const createTable = async () => {
  // await db.execAsync([{ sql: 'PRAGMA foreign_keys = ON;', args: [] }], false);

  db.executeSql('PRAGMA foreign_keys = ON;');

  db.transaction((tx) => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS Utilisateurs (
             ID_Utilisateur TEXT PRIMARY KEY,
             Nom_Utilisateur TEXT NOT NULL,
             Url_Pic TEXT,
             Last_Seen INTEGER NOT NULL
           )`
    );
  });

  db.transaction((tx) => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS Groupes (
             ID_Groupe VARCHAR(32) PRIMARY KEY,
             Nom_Groupe VARCHAR(250) NOT NULL
           )`
    );
  });

  db.transaction((tx) => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS Conversations (
             ID_Conversation VARCHAR(32) PRIMARY KEY,
             Type_Conversation VARCHAR(32) NOT NULL,
             ID_DESTINATAIRE VARCHAR(32),
             ID_Groupe VARCHAR(32)
           )`
    );
  });

  db.transaction((tx) => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS Participants (
             ID_Utilisateur VARCHAR(32),
             ID_Groupe VARCHAR(32)
           )`
    );
  });

  db.transaction((tx) => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS Files (
             ID_File INTEGER PRIMARY KEY AUTOINCREMENT,
             ID_Message VARCHAR(32) NOT NULL,
             url TEXT,
             uri TEXT,
             size INTEGER,
             extension TEXT,
             fileName TEXT,
             encoding VARCHAR(32),
             type VARCHAR(32),
             buffer BLOB
           )`
    );
  });

  db.transaction((tx) => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS Messages (
           ID_Message VARCHAR(32) PRIMARY KEY,
           ID_Conversation VARCHAR(32) NOT NULL,
           ID_Expediteur VARCHAR(32),
           Contenu_Message TEXT ,
           Horodatage INTEGER NOT NULL
         )`
    );
  });

  db.transaction((tx) => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS StatutLecture (
             ID_StatutLecture INTEGER PRIMARY KEY AUTOINCREMENT,
             ID_Message VARCHAR(32) NOT NULL,
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
  });

  db.transaction((tx) => {
    tx.executeSql(
      `ALTER TABLE Messages
           ADD FOREIGN KEY (ID_Conversation) REFERENCES Conversations (ID_Conversation),
           ADD FOREIGN KEY (ID_Expediteur) REFERENCES Utilisateurs (ID_Utilisateur),`
    );
  });

  db.transaction((tx) => {
    tx.executeSql(
      `ALTER TABLE Conversations
           ADD FOREIGN KEY (ID_DESTINATAIRE) REFERENCES Utilisateurs (ID_Utilisateur),
           ADD FOREIGN KEY (ID_Groupe) REFERENCES Groupes (ID_Groupe)`
    );
  });

  db.transaction((tx) => {
    tx.executeSql(
      `ALTER TABLE ParticipantsAuGroupe
           ADD FOREIGN KEY (ID_Utilisateur) REFERENCES Utilisateurs (ID_Utilisateur),
           ADD FOREIGN KEY (ID_Groupe) REFERENCES Groupes (ID_Groupe)`
    );
  });

  db.transaction((tx) => {
    tx.executeSql(
      `ALTER TABLE StatutLecture
         ADD FOREIGN KEY (ID_Message) REFERENCES Messages (ID_Message)`
    );
  });

  db.transaction((tx) => {
    tx.executeSql(
      `ALTER TABLE StatutLecture
         ADD FOREIGN KEY (ID_Message) REFERENCES Messages (ID_Message)`
    );
  });

  db.transaction((tx) => {
    tx.executeSql('CREATE INDEX IF NOT EXISTS idx_ID_Conversation ON Messages (ID_Conversation)');
  });

  db.transaction((tx) => {
    tx.executeSql('CREATE INDEX IF NOT EXISTS idx_ID_Utilisateurs ON Utilisateurs (ID_Utilisateur)');
  });

  db.transaction((tx) => {
    tx.executeSql('CREATE INDEX IF NOT EXISTS idx_ID_Messages ON Messages (ID_Message)');
  });
  db.transaction((tx) => {
    tx.executeSql('CREATE INDEX IF NOT EXISTS idx_ID_Message_StatutLecture ON StatutLecture (ID_Message)');
  });
  db.transaction((tx) => {
    tx.executeSql('CREATE INDEX IF NOT EXISTS idx_ID_Message_Files ON Files (ID_Message)');
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

export const dropAllTables = () => {
  db.transaction((tx) => {
    tx.executeSql(`SELECT name FROM sqlite_master WHERE type='table';`, [], (_, result) => {
      for (let i = 0; i < result.rows.length; i++) {
        tx.executeSql(`DROP TABLE IF EXISTS ${result.rows.item(i).name};`);
        console.log(`Table ${result.rows.item(i).name} supprimée.`);
      }
    });
  });
};
