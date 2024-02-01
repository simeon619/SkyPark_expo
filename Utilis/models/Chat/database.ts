import * as FileSystem from 'expo-file-system';
type TableInterface =
	| 'Utilisateur'
	| 'Groupe'
	| 'Conversation'
	| 'Participant'
	| 'Message'
	| 'Files'
	| 'StatutLecture';

let ext = '.lo';

export const getContentFile = async (fileName: TableInterface) => {
	// await FileSystem.deleteAsync(FileSystem.documentDirectory + fileName + '.db');

	const info = await FileSystem.getInfoAsync(FileSystem.documentDirectory + fileName + ext);
	if (!info.exists) {
		FileSystem.writeAsStringAsync(
			FileSystem.documentDirectory + fileName + ext,
			fileName === 'Message' ? '{}' : '[]',
			{
				encoding: FileSystem.EncodingType.UTF8,
			}
		);
	}
	return await FileSystem.readAsStringAsync(FileSystem.documentDirectory + fileName + ext, {
		encoding: FileSystem.EncodingType.UTF8,
	});
};

export const saveContentFile = async (fileName: TableInterface, content: string) => {
	// await FileSystem.deleteAsync(FileSystem.documentDirectory + fileName + '.db');

	await FileSystem.writeAsStringAsync(FileSystem.documentDirectory + fileName + ext, content, {
		encoding: FileSystem.EncodingType.UTF8,
	});
};

export interface Utilisateur {
	idUtilisateur: string;
	nomUtilisateur: string;
	urlPic: string;
	lastSeen: number;
}

export interface Groupe {
	idGroupe: string;
	nomGroupe: string;
}

export interface Conversation {
	idConversation: string;
	typeConversation: 'private' | 'group';
	idDestinataire: string | null;
	idGroupe: string | null;
}

export interface Participant {
	idUtilisateur: string;
	idGroupe: string;
}

export interface File {
	idFile?: number;
	idMessage?: string;
	url: string | null;
	uri?: string;
	size: number;
	extension: string;
	fileName?: string;
	encoding?:
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
	type?: string;
	buffer: string | Buffer | ArrayBuffer | null;
}

export interface Message {
	idMessage: string;
	idConversation: string;
	idExpediteur: string | null;
	contenuMessage: string | null;
	horodatage: number;
}

export interface StatutLecture {
	idStatutLecture: number;
	idMessage: string;
	dateEnvoye: number | null;
	dateReçu: number | null;
	dateLu: number | null;
}
