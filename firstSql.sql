-- TABLE
CREATE TABLE Conversations (
  ID_Conversation INTEGER PRIMARY KEY,
  Type_Conversation TEXT,
  ID_DESTINATAIRE INTEGER,
  ID_Groupe INTEGER,
  FOREIGN KEY (ID_DESTINATAIRE) REFERENCES Utilisateurs (ID_Utilisateur)
 );
CREATE TABLE Files (
   _id INTEGER PRIMARY KEY,
   ID_Message INTEGER,
   URL TEXT,
   Size INTEGER,
   Extension TEXT,
  FOREIGN KEY (ID_Message) REFERENCES Messages (ID_Message)
 );
CREATE TABLE Groupes (
   ID_Groupe INTEGER PRIMARY KEY,
   Nom_Groupe TEXT
 );
CREATE TABLE Messages (
   ID_Message INTEGER PRIMARY KEY,
   ID_Conversation INTEGER,
   ID_Expediteur INTEGER,
   Contenu_Message TEXT,
   Horodatage DATETIME,
   ID_Files INTEGER, 
   FOREIGN KEY (ID_Conversation) REFERENCES Conversations (ID_Conversation),
   FOREIGN KEY (ID_Expediteur) REFERENCES Utilisateurs (ID_Utilisateur),
   FOREIGN KEY (ID_Files) REFERENCES Files (_id) -- Clé étrangère pour le fichier
 );
CREATE TABLE ParticipantsAuGroupe (
   ID_ParticipantAuGroupe INTEGER PRIMARY KEY,
   ID_Utilisateur INTEGER,
   ID_Groupe INTEGER,
  FOREIGN KEY (ID_Utilisateur) REFERENCES Utilisateurs (ID_Utilisateur),
   FOREIGN KEY (ID_Groupe) REFERENCES Groupes (ID_Groupe)
 );
CREATE TABLE StatutLecture (
   ID_StatutLecture INTEGER PRIMARY KEY,   ID_Message INTEGER,
   Date_Envoye DATETIME,
  Date_Reçu DATETIME,
  Date_Lu DATETIME,
  FOREIGN KEY (ID_Message) REFERENCES Messages (ID_Message)
);
CREATE TABLE Utilisateurs (
  ID_Utilisateur INTEGER PRIMARY KEY,
   Nom_Utilisateur TEXT,
  Url_Pic  TEXT,
   Last_Seen  DATETIME
 );
 