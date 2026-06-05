import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  ActivityIndicator
} from 'react-native';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { saveSession, getSession, getFocusListApps, saveFocusListApps } from '../storage/storage';
import AppCard from '../components/AppCard';
import DurationChip from '../components/DurationChip';
import { RootStackParamList } from '../navigation/types';
import FocusBlocker from '../native/FocusBlocker';
import { Colors } from '../theme/colors';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'Home'
>;



export default function HomeScreen({
  navigation,
}: Props) {
  const [apps, setApps] = useState<any[]>([]);
  const [modalVisible, setModalVisible] =
    useState(false);

  const [allApps, setAllApps] =
    useState<any[]>([]);

  const [search, setSearch] =
    useState('');
  const [duration, setDuration] = useState(60);
  const [
    accessibilityEnabled,
    setAccessibilityEnabled,
  ] = useState(true);


  const loadAllApps = async () => {
    try {
      const installedApps =
        await FocusBlocker.getInstalledApps();

      const focusApps =
        await getFocusListApps();

      const focusPackages =
        focusApps.map(
          (app: any) =>
            app.packageName,
        );

      const availableApps =
        installedApps
          .filter(
            (app: any) =>
              !focusPackages.includes(
                app.packageName,
              ),
          )
          .map((app: any) => ({
            ...app,
            selected: false,
          }))
          .sort(
            (a: any, b: any) =>
              a.name.localeCompare(
                b.name,
              ),
          );

      setAllApps(
        availableApps,
      );
    } catch (error) {
      console.log(error);
    }
  };
  const checkAccessibility =
    async () => {

      const enabled =
        await FocusBlocker
          .isAccessibilityEnabled();

      setAccessibilityEnabled(
        enabled,
      );
    };

  const loadFocusApps = async () => {
    try {
      const focusApps =
        await getFocusListApps();

      setApps(focusApps);

    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    loadFocusApps();
    checkAccessibility();
  }, []);






  const startFocus = async () => {
    const enabled =
      await FocusBlocker
        .isAccessibilityEnabled();

    if (!enabled) {
      Alert.alert(
        'Accessibility Required',
        'Focus Shield cannot block apps until Accessibility Service is enabled.',
      );

      return;
    }
    const selectedApps =
      apps.map(
        app => app.packageName,
      );

    const selectedAppNamesArray =
      apps.map(
        app => app.name,
      );

    const selectedAppNames =
      selectedAppNamesArray.join(', ');
    if (!apps.length) {
      Alert.alert(
        'No Apps Selected',
        'Please select at least one app.',
      );
      return;
    }

    const endTime =
      Date.now() + duration * 60 * 1000;

 await saveSession({
  active: true,
  endTime,
  duration,
  apps: selectedApps,
  appNames: selectedAppNamesArray,
  blockedApps: apps,
});
    await FocusBlocker.saveBlockedApps(
      selectedApps,
    );
    await FocusBlocker.saveSessionEndTime(
      endTime,
    );
    await FocusBlocker
      .saveBlockedAppNames(
        selectedAppNames,
      );
    await FocusBlocker
      .startForegroundService();
    navigation.replace('Focus');
  };
  useEffect(() => {
    checkActiveSession();
  }, []);
  const toggleModalApp = (
    packageName: string,
  ) => {
    setAllApps(prev =>
      prev.map(app =>
        app.packageName ===
          packageName
          ? {
            ...app,
            selected:
              !app.selected,
          }
          : app,
      ),
    );
  };
  const addSelectedApps =
    async () => {

      const currentApps =
        await getFocusListApps();

      const selectedApps =
        allApps.filter(
          app => app.selected,
        );

      const updatedApps = [
        ...currentApps,
        ...selectedApps,
      ];

      await saveFocusListApps(
        updatedApps,
      );

      setModalVisible(
        false,
      );

      loadFocusApps();
    };
  const checkActiveSession =
    async () => {
      const session =
        await getSession();

      if (!session) {
        return;
      }

      if (
        session.endTime >
        Date.now()
      ) {
        navigation.replace(
          'Focus',
        );
      }
    };

  const removeApp =
    async (
      packageName: string,
    ) => {

      const updatedApps =
        apps.filter(
          app =>
            app.packageName !==
            packageName,
        );

      setApps(updatedApps);

      await saveFocusListApps(
        updatedApps,
      );
    };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.brand}>
          Ready to Focus?
        </Text>

        <Text style={styles.subtitle}>
          Make room for what matters.
        </Text>
      </View>
      {!accessibilityEnabled && (
        <TouchableOpacity
          style={styles.warningBanner}
          onPress={() =>
            FocusBlocker.openAccessibilitySettings()
          }>

          <Text style={styles.warningTitle}>
            ⚠ Protection Disabled
          </Text>

          <Text style={styles.warningDescription}>
            Accessibility Service is OFF.
            Focus Shield cannot block apps
            until it is enabled.
          </Text>

          <Text style={styles.warningAction}>
            Tap to Enable
          </Text>

        </TouchableOpacity>
      )}
      <View style={styles.section}>
        <Text style={styles.sectionSubtitle}>
          My Focus Apps
        </Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={async () => {
            setModalVisible(true);
            await loadAllApps();
            
          }}>
          <Text style={styles.addButtonText}>
            + Add Apps
          </Text>
        </TouchableOpacity>
      </View>
      {apps.length === 0 && (
        <Text
          style={{
            marginBottom: 20,
            color: '#666',
          }}>
          No focus apps selected.
        </Text>
      )}
      <FlatList
        data={apps}
        keyExtractor={item => item.packageName}
        renderItem={({ item }) => (
          <AppCard
            name={item.name}
            icon={item.icon}
            showRemove
            onRemove={() =>
              removeApp(
                item.packageName,
              )
            }
          />
        )}
        style={styles.list}
      />
      <TouchableOpacity
        onPress={async () => {
          await loadAllApps();

          setModalVisible(
            true,
          );
        }}>

      </TouchableOpacity>
      <Text style={styles.sectionTitle}>
        Focus Duration
      </Text>

      <View style={styles.durationRow}>
        <DurationChip
          label="1m"
          active={duration === 1}
          onPress={() =>
            setDuration(1)
          }
        />
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
          Start Focus
        </Text>
      </TouchableOpacity>
      <Modal
        visible={modalVisible}
        animationType="slide">

        <View
          style={{
            flex: 1,
            padding: 20,
            backgroundColor:
              Colors.background,
          }}>

          <Text
            style={{
              fontSize: 18,
              fontWeight: '700',
              marginVertical: 20,
            }}>
            Add Apps to your focus list
          </Text>

          <TextInput
            value={search}
            onChangeText={
              setSearch
            }
            placeholder="Search Apps"
            placeholderTextColor={Colors.textSecondary}
            style={{
              borderWidth: 1,
              borderColor: '#ddd',
              borderRadius: 12,
              padding: 12,
              marginBottom: 20,
              color: Colors.text
            }}
          />

{allApps.length === 0 ? (
  <ActivityIndicator
    size="small"
    style={{
      marginVertical: 20,
    }}
  />
) : (
  <FlatList
    data={allApps.filter(
      app =>
        app.name
          .toLowerCase()
          .includes(
            search.toLowerCase(),
          ),
    )}
    keyExtractor={item =>
      item.packageName
    }
    renderItem={({item}) => (
      <TouchableOpacity
        style={{
          padding: 16,
          borderBottomWidth: 1,
          borderBottomColor: '#eee',
        }}
        onPress={() =>
          toggleModalApp(
            item.packageName,
          )
        }>
        <Text>
          {item.selected
            ? '✓ '
            : ''}
          {item.name}
        </Text>
      </TouchableOpacity>
    )}
  />
)}

          <TouchableOpacity
            style={
              styles.startButton
            }
            onPress={
              addSelectedApps
            }>
            <Text
              style={
                styles.startButtonText
              }>
              DONE
            </Text>
          </TouchableOpacity>

        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    backgroundColor: Colors.background
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
    backgroundColor: Colors.primary,
    height: 58,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical:10
  },

  startButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  warningBanner: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FCD34D',
    padding: 8,
    marginVertical: 10
  },

  warningText: {
    fontWeight: '600',
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },

  warningDescription: {
    fontSize: 14,
    lineHeight: 20,
  },

  warningAction: {
    marginTop: 8,
    fontWeight: '700',
  },
  header: {
    marginTop: 40,
    marginBottom: 10,
  },

  brand: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.primary
  },

  subtitle: {
    marginTop: 8,
    fontSize: 15,
    color: '#8A8A8A',
  },

  section: {
    marginBottom: 12,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
  },

  sectionSubtitle: {
    marginTop: 4,
    color: '#666',
  },

  addButton: {
    borderWidth: 0.5,
    padding: 8,
    borderRadius: 20,
    borderColor: Colors.primary,
  },

  addButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.primary
  },
});