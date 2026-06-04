import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  FlatList,
} from 'react-native';

import {
  saveFocusListApps,
  saveOnboardingStatus,
} from '../storage/storage';

import FocusBlocker from '../native/FocusBlocker';

export default function OnboardingScreen({
  navigation,
}: any) {
  const [apps, setApps] = useState<any[]>([]);

  useEffect(() => {
    loadApps();
  }, []);

  const loadApps = async () => {
    try {
      const installedApps =
        await FocusBlocker.getInstalledApps();

      const formattedApps =
        installedApps
          .map((app: any) => ({
            ...app,
            selected: false,
          }))
          .sort((a: any, b: any) =>
            a.name.localeCompare(b.name),
          );

      setApps(formattedApps);
    } catch (error) {
      console.log(error);
    }
  };

  const toggleApp = (
    packageName: string,
  ) => {
    setApps(prev =>
      prev.map(app =>
        app.packageName === packageName
          ? {
              ...app,
              selected: !app.selected,
            }
          : app,
      ),
    );
  };

  const finishOnboarding =
    async () => {
      const selectedApps =
        apps.filter(
          app => app.selected,
        );

      if (
        !selectedApps.length
      ) {
        Alert.alert(
          'Select Apps',
          'Choose at least one app.',
        );

        return;
      }

      await saveFocusListApps(
        selectedApps,
      );

      await saveOnboardingStatus();

      navigation.replace(
        'Home',
      );
    };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Choose Your Focus Apps
      </Text>

      <Text style={styles.subtitle}>
        Select apps that usually
        distract you.
      </Text>

      <FlatList
        data={apps}
        keyExtractor={item =>
          item.packageName
        }
        renderItem={({item}) => (
          <TouchableOpacity
            style={[
              styles.appItem,
              item.selected &&
                styles.selectedApp,
            ]}
            onPress={() =>
              toggleApp(
                item.packageName,
              )
            }>
            <Text
              style={
                styles.appText
              }>
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
        style={styles.list}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={
          finishOnboarding
        }>
        <Text
          style={styles.buttonText}>
          Continue
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
  },

  title: {
    fontSize: 30,
    fontWeight: '700',
    marginTop: 20,
  },

  subtitle: {
    marginTop: 8,
    marginBottom: 20,
    color: '#666',
  },

  list: {
    flex: 1,
  },

  appItem: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 12,
    marginBottom: 10,
  },

  selectedApp: {
    borderColor: '#000',
    backgroundColor: '#f5f5f5',
  },

  appText: {
    fontSize: 16,
    fontWeight: '500',
  },

  button: {
    backgroundColor: '#111',
    paddingVertical: 18,
    borderRadius: 14,
    marginTop: 20,
  },

  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
});