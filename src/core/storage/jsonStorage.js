import AsyncStorage from '@react-native-async-storage/async-storage';

async function setItem(key, value, strict = false) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    if (strict) throw err;
    console.warn('[storage] setItem error for key ' + key);
  }
}

async function getItem(key, fallback = null, strict = false) {
  try {
    const value = await AsyncStorage.getItem(key);

    if (value === null) {
      return fallback;
    }

    return JSON.parse(value);
  } catch (err) {
    if (strict) throw err;
    return fallback;
  }
}

async function removeItem(key) {
  try {
    await AsyncStorage.removeItem(key);
  } catch (err) {
    console.warn('[storage] removeItem error for key ' + key, err);
  }
}

async function clearStorage() {
  try {
    await AsyncStorage.clear();
  } catch (err) {
    console.warn('[storage] clearStorage error', err);
  }
}

export {
  setItem,
  getItem,
  removeItem,
  clearStorage,
};