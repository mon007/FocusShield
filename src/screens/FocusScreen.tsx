import React, {
  useEffect,
  useState,
} from 'react';

import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  BackHandler,
  Image
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

import {RootStackParamList} from '../navigation/types';

import FocusBlocker from '../native/FocusBlocker';

import {
  getSession,
  clearSession,
} from '../storage/storage';
import { Colors } from '../theme/colors';

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
  useState<any[]>([]);
useEffect(() => {
  const backAction = () => {
    return true;
  };

  const subscription =
    BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

  return () =>
    subscription.remove();
}, []);
  useEffect(() => {
    loadSession();

    const interval = setInterval(() => {
      updateRemainingTime();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

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

 setBlockedApps(
  session.blockedApps ?? [],
);

    const remaining = Math.max(
      0,
      Math.floor(
        (session.endTime -
          Date.now()) /
          1000,
      ),
    );

    if (remaining <= 0) {
      await handleSessionComplete();
      return;
    }

    setSecondsLeft(remaining);
  };

  const updateRemainingTime =
    async () => {
      const session =
        await getSession();

      if (!session) {
        return;
      }

      const remaining = Math.max(
        0,
        Math.floor(
          (session.endTime -
            Date.now()) /
            1000,
        ),
      );

      if (remaining <= 0) {
        await handleSessionComplete();
        return;
      }

      setSecondsLeft(remaining);
    };

  const handleSessionComplete =
    async () => {
      await clearSession();

      await FocusBlocker.stopForegroundService();

      await FocusBlocker.clearFocusSession();

      goHome();
    };

  const stopSession =
    async () => {
      await clearSession();

      await FocusBlocker.stopForegroundService();

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
  <SafeAreaView
  style={styles.container}>

  <View
    style={styles.header}>

    <Text
      style={styles.timer}>
      {formatTime(secondsLeft)}
    </Text>

    <Text
      style={styles.remaining}>
      remaining
    </Text>

    <Text
      style={styles.title}>
      Focus Active
    </Text>

    <Text
      style={styles.subtitle}>
      {blockedApps.length} apps protected
    </Text>

  </View>

  <View style={styles.listContainer}>
    <FlatList
      data={blockedApps}
      keyExtractor={item => item.packageName}
      renderItem={({item}) => (
       <View style={styles.appRow}>

  <Image
    source={{
      uri: `data:image/png;base64,${item.icon}`,
    }}
    style={styles.icon}
  />

  <Text style={styles.appText}>
    {item.name}
  </Text>

</View>
      )}
    />
  </View>

  <TouchableOpacity
    style={styles.stopButton}
    onPress={stopSession}>
    <Text
      style={styles.stopButtonText}>
      End Session
    </Text>
  </TouchableOpacity>

</SafeAreaView>
  );
}

const styles = StyleSheet.create({


container: {
  flex: 1,
  backgroundColor: '#F8F7F4',
  paddingHorizontal: 24,
},

header: {
  alignItems: 'center',
  marginTop: 40,
},

timer: {
  fontSize: 64,
  fontWeight: '700',
  color: '#111',
},

remaining: {
  marginTop: 4,
  color: '#888',
  fontSize: 14,
},

title: {
  marginTop: 32,
  fontSize: 24,
  fontWeight: '700',
  color: Colors.primary,
},

subtitle: {
  marginTop: 6,
  color: '#666',
  fontSize: 15,
},

listContainer: {
  flex: 1,
  marginTop: 40,
},

icon: {
  width: 32,
  height: 32,
  borderRadius: 8,
  marginRight: 12,
},

appRow: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: 18,
  borderBottomWidth: 1,
  borderBottomColor: '#ECECEC',
},

appText: {
  fontSize: 16,
  color: '#111',
},

stopButton: {
  height: 58,
  borderRadius: 16,
  borderWidth: 1,
  borderColor: '#EF4444',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: 24,
},

stopButtonText: {
  color: '#EF4444',
  fontWeight: '600',
  fontSize: 16,
},
});