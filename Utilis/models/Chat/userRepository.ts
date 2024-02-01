import { Conversation, getContentFile, saveContentFile } from './database';

export interface UserSchema {
	idUtilisateur: string;
	idConversation: string;
	nomUtilisateur: string;
	urlPic?: string;
	lastSeen: number;
}

export const addUser = async (newUser: UserSchema) => {
	const FileUser = await getContentFile('Utilisateur');

	let users: UserSchema[] = JSON.parse(FileUser);

	let userExist = users.find((u) => u.idUtilisateur === newUser.idUtilisateur);
	console.log('🚀 ~ addUser ~ userExist:', newUser);

	if (!userExist) {
		users.push(newUser);
		saveContentFile('Utilisateur', JSON.stringify(users));
		console.info('Utilisateur ajouté avec succès.');
		return newUser;
	}

	return newUser;
};

export const readUser = async (userID: string): Promise<UserSchema | null> => {
	const FileUser = await getContentFile('Utilisateur');

	const convs = await getContentFile('Conversation');

	let users: UserSchema[] = JSON.parse(FileUser);

	let conversations: Conversation[] = JSON.parse(convs);

	let userExist = users.find((u) => u.idUtilisateur === userID);

	let convExist = conversations.find((c) => c.idDestinataire === userID);

	if (!userExist || !convExist) {
		return null;
	}

	return { ...userExist, idUtilisateur: convExist.idConversation };
};

export const getAllUsers = async (pageNumber: number, itemsPerPage: number) => {
	const offset = (pageNumber - 1) * itemsPerPage;
	let userExist: UserSchema[] = [];

	const FileUser = await getContentFile('Utilisateur');
	if (!FileUser) return [];
	const convs = await getContentFile('Conversation');
	let conversations: Conversation[] = JSON.parse(convs);

	let users: UserSchema[] = JSON.parse(FileUser);
	if (Array.isArray(users)) {
		userExist = users?.slice(offset, itemsPerPage).map((u) => {
			let convExist = conversations.find((c) => c.idDestinataire === u.idUtilisateur);
			return { ...u, ID_Conversation: convExist?.idConversation };
		});
	} else {
		console.error("FileUser n'est pas un tableau.");
	}

	return userExist;
};

// let u = await readUser("")
