import AsyncStorage from '@react-native-async-storage/async-storage';

export const StorageKeys = {
  ACTIVE_SESSION: 'ACTIVE_SESSION',
};

export const saveSession = async (
  session: any,
) => {
  await AsyncStorage.setItem(
    StorageKeys.ACTIVE_SESSION,
    JSON.stringify(session),
  );
};

export const getSession = async () => {
  const value = await AsyncStorage.getItem(
    StorageKeys.ACTIVE_SESSION,
  );

  return value ? JSON.parse(value) : null;
};

export const clearSession = async () => {
  await AsyncStorage.removeItem(
    StorageKeys.ACTIVE_SESSION,
  );
};