import AsyncStorage from '@react-native-async-storage/async-storage';

export const StorageKeys = {
  ACTIVE_SESSION: 'ACTIVE_SESSION',

  HAS_COMPLETED_ONBOARDING:
    'HAS_COMPLETED_ONBOARDING',

  FOCUS_LIST_APPS:
    'FOCUS_LIST_APPS',
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

export const saveOnboardingStatus =
  async () => {
    await AsyncStorage.setItem(
      StorageKeys.HAS_COMPLETED_ONBOARDING,
      'true',
    );
  };

export const hasCompletedOnboarding =
  async () => {
    const value =
      await AsyncStorage.getItem(
        StorageKeys.HAS_COMPLETED_ONBOARDING,
      );

    return value === 'true';
  };
  export const saveFocusListApps =
  async (apps: any[]) => {
    await AsyncStorage.setItem(
      StorageKeys.FOCUS_LIST_APPS,
      JSON.stringify(apps),
    );
  };

export const getFocusListApps =
  async () => {
    const value =
      await AsyncStorage.getItem(
        StorageKeys.FOCUS_LIST_APPS,
      );

    return value
      ? JSON.parse(value)
      : [];
  };