import AsyncStorage from '@react-native-async-storage/async-storage';
const removeValue = async (keyStorage: string) => {
  try {
    await AsyncStorage.removeItem(keyStorage);
  } catch (e) {}
};
const setStringValue = async (key: string, value: string) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    console.info('Error storing cookie:', e);
  }
};
const getMyStringValue = async (key: string) => {
  try {
    return await AsyncStorage.getItem(key);
  } catch (e) {
    // read error
  }
};

export { getMyStringValue, removeValue, setStringValue };
