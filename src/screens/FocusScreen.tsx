import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';

import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/types';
import FocusBlocker from '../native/FocusBlocker';
import {
  getSession,
  clearSession,
} from '../storage/storage';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'Focus'
>;

export default function FocusScreen({
  navigation,
}: Props) {
  const [secondsLeft, setSecondsLeft] =
    useState(0);

  const [blockedApps, setBlockedApps] =
    useState<string[]>([]);

  useEffect(() => {
    loadSession();
  }, []);

  useEffect(() => {
    if (secondsLeft <= 0) {
      return;
    }

    const interval = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          handleSessionComplete();
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [secondsLeft]);

  const goHome = () => {
    navigation.reset({
      index: 0,
      routes: [{name: 'Home'}],
    });
  };

  const loadSession = async () => {
    const session = await getSession();

    if (!session) {
      goHome();
      return;
    }

    setBlockedApps(session.apps);

    const remaining = Math.floor(
      (session.endTime - Date.now()) / 1000,
    );

    if (remaining <= 0) {
      await clearSession();
      goHome();
      return;
    }

    setSecondsLeft(remaining);
  };

const handleSessionComplete =
  async () => {
    await clearSession();
await FocusBlocker
  .stopForegroundService();
    await FocusBlocker.clearFocusSession();

    goHome();
  };

 const stopSession = async () => {
  await clearSession();
  await FocusBlocker
  .stopForegroundService();

  await FocusBlocker.clearFocusSession();

  goHome();
};

  const formatTime = (
    totalSeconds: number,
  ) => {
    const hours = Math.floor(
      totalSeconds / 3600,
    );

    const minutes = Math.floor(
      (totalSeconds % 3600) / 60,
    );

    const seconds =
      totalSeconds % 60;

    return `${String(hours).padStart(
      2,
      '0',
    )}:${String(minutes).padStart(
      2,
      '0',
    )}:${String(seconds).padStart(
      2,
      '0',
    )}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Focus Active
      </Text>

      <Text style={styles.timer}>
        {formatTime(secondsLeft)}
      </Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Blocked Apps
        </Text>

        <FlatList
          data={blockedApps}
          keyExtractor={item => item}
          renderItem={({item}) => (
            <View style={styles.appItem}>
              <Text style={styles.appText}>
                • {item}
              </Text>
            </View>
          )}
        />
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.stopButton}
          onPress={stopSession}>
          <Text style={styles.stopButtonText}>
            STOP SESSION
          </Text>
        </TouchableOpacity>
      </View>
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
    marginTop: 20,
  },

  timer: {
    fontSize: 48,
    fontWeight: '700',
    textAlign: 'center',
    marginVertical: 30,
  },

  section: {
    flex: 1,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },

  appItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },

  appText: {
    fontSize: 18,
  },

  footer: {
    paddingBottom: 30,
  },

  stopButton: {
    backgroundColor: '#000',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
  },

  stopButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});