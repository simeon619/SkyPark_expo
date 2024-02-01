import AsyncStorage from '@react-native-async-storage/async-storage';
const removeValue = async (keyStorage: string) => {
	try {
		await AsyncStorage.removeItem(keyStorage);
	} catch (e) {}
};
const setStringValue = async (key: string | undefined, value: string) => {
	if (!key) return;
	try {
		await AsyncStorage.setItem(key, value);
	} catch (e) {
		console.info('Error storing cookie:', e);
	}
};
const getMyStringValue = async (key: string | undefined) => {
	if (!key) return;
	try {
		return await AsyncStorage.getItem(key);
	} catch (e) {
		// read error
	}
};

export { getMyStringValue, removeValue, setStringValue };
