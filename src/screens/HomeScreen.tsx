import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';

import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {saveSession} from '../storage/storage';
import AppCard from '../components/AppCard';
import DurationChip from '../components/DurationChip';
import {RootStackParamList} from '../navigation/types';
import FocusBlocker from '../native/FocusBlocker';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'Home'
>;



export default function HomeScreen({
  navigation,
}: Props) {
 const [apps, setApps] = useState<any[]>([]);
  const [duration, setDuration] = useState(60);
const testNativeModule = async () => {
  try {
    const deviceName =
      await FocusBlocker.getDeviceName();

    console.log(
      'Device Name:',
      deviceName,
    );
  } catch (e) {
    console.log(e);
  }
};
const loadInstalledApps = async () => {
  try {
    const apps =
      await FocusBlocker.getInstalledApps();

    console.log(
      'Installed Apps:',
      apps,
    );
  } catch (error) {
    console.log(error);
  }
};
useEffect(() => {
  testNativeModule();
  loadInstalledApps();
}, []);



// actual call of loaded apps from native module

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

useEffect(() => {
  loadApps();
}, []);




const toggleApp = (packageName: string) => {
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

const startFocus = async () => {
const selectedApps = apps
  .filter(app => app.selected)
  .map(app => app.packageName);

  if (!selectedApps.length) {
    Alert.alert(
      'No Apps Selected',
      'Please select at least one app.',
    );
    return;
  }

  const endTime =
    Date.now() + duration * 60 * 1000;

  await saveSession({
    endTime,
    duration,
    apps: selectedApps,
  });
  await FocusBlocker.saveBlockedApps(
  selectedApps,
);
await FocusBlocker.saveSessionEndTime(
  endTime,
);
navigation.navigate('Focus');
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Focus Shield
      </Text>

      <Text style={styles.heading}>
        Select Apps
      </Text>

      <FlatList
        data={apps}
        keyExtractor={item => item.packageName}
        renderItem={({item}) => (
          <AppCard
      name={item.name}
      selected={item.selected}
      onPress={() =>
        toggleApp(item.packageName)
      }
    />
        )}
        style={styles.list}
      />

      <Text style={styles.heading}>
        Duration
      </Text>

      <View style={styles.durationRow}>
        <DurationChip
          label="30m"
          active={duration === 30}
          onPress={() =>
            setDuration(30)
          }
        />

        <DurationChip
          label="1h"
          active={duration === 60}
          onPress={() =>
            setDuration(60)
          }
        />

        <DurationChip
          label="2h"
          active={duration === 120}
          onPress={() =>
            setDuration(120)
          }
        />
      </View>

      <TouchableOpacity
        style={styles.startButton}
        onPress={startFocus}>
        <Text style={styles.startButtonText}>
          START FOCUS
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },

  title: {
    fontSize: 30,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 24,
    marginTop: 10,
  },

  heading: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },

  list: {
    flexGrow: 0,
    marginBottom: 20,
  },

  durationRow: {
    flexDirection: 'row',
    marginBottom: 30,
  },

  startButton: {
    backgroundColor: '#000',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
  },

  startButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});