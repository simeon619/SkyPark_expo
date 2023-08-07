import AsyncStorage from '@react-native-async-storage/async-storage';
const removeValue = async (keyStorage: string) => {
  try {
    await AsyncStorage.removeItem(keyStorage);
  } catch (e) {}
  console.log('Done. removeItem');
};
const setStringValue = async (key: string, value: string) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    console.log('Error storing cookie:', e);
  }
  console.log('Done.');
};
const getMyStringValue = async (key: string) => {
  try {
    return await AsyncStorage.getItem(key);
  } catch (e) {
    // read error
  }

  console.log('Done.');
};

export { getMyStringValue, removeValue, setStringValue };
