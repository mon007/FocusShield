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
  ActivityIndicator,
  ScrollView
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
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          styles.scrollContent
        }>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.screenLabel}>
              Today's
            </Text>
              <Text style={[styles.screenLabel]}>
               Focus
            </Text>
          </View>
          <Text style={styles.subtitle}>Stay present. Stay intentional.</Text>
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

          <View style={styles.appsCard}>

            <View style={styles.appsHeader}>
              <View>
                <Text style={styles.appsCount}>
                  {apps.length} Apps Protected
                </Text>

                <Text style={styles.appsCaption}>
                  Your focus list
                </Text>
              </View>

              <TouchableOpacity
                style={styles.addButton}
                onPress={async () => {
                  setModalVisible(true);
                  await loadAllApps();
                }}>

                <Text style={styles.addButtonText}>
                  + Add
                </Text>

              </TouchableOpacity>

            </View>

            {apps.length === 0 ? (
              <Text style={styles.emptyState}>
                No apps added yet
              </Text>
            ) : (
              <FlatList
                data={apps}
                nestedScrollEnabled
                keyExtractor={item => item.packageName}
                renderItem={({ item }) => (

                  <AppCard
                    name={item.name}
                    icon={item.icon}
                    showRemove
                    onRemove={() =>
                      removeApp(item.packageName)
                    }
                  />


                )}
                showsVerticalScrollIndicator={false}
                style={styles.appsList}
              />
            )}

          </View>
          <TouchableOpacity
            onPress={async () => {
              await loadAllApps();

              setModalVisible(
                true,
              );
            }}>

          </TouchableOpacity>
          <View style={styles.bottomSection}>
            <View style={styles.durationCard}>

              <Text style={styles.durationTitle}>
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
                  label="1hr"
                  active={duration === 60}
                  onPress={() =>
                    setDuration(60)
                  }
                />

                <DurationChip
                  label="2hr"
                  active={duration === 120}
                  onPress={() =>
                    setDuration(120)
                  }
                />
              </View>

            </View>
            <TouchableOpacity
              style={styles.startButton}
              onPress={startFocus}>
              <Text style={styles.startButtonText}>
                Start Focus
              </Text>
            </TouchableOpacity>
          </View>
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
                  renderItem={({ item }) => (
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
        </View>
      </ScrollView>
    </SafeAreaView>


  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 24,
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
    backgroundColor: '#111',
    height: 64,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,

    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 16,
    shadowOffset: {
      width: 0,
      height: 8,
    },

    elevation: 8,
  },

  startButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  warningBanner: {
    backgroundColor: '#FEF3C7',
    borderWidth: 0.5,
    borderColor: '#FCD34D',
    padding: 12,
    marginVertical: 20,
    borderRadius: 10,
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
    flexDirection: 'row',
    gap:4
  },

  brand: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text
  },

  subtitle: {
    marginLeft:2,
   // marginTop: 8,
    fontSize: 14,
    color: '#2E7D32',
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
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderColor: Colors.primary,
  },

  addButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.primary
  },
  screenLabel: {
    fontSize: 28,
    fontWeight: '700',
  },
  appsCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    marginVertical: 24,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 4,
  },

  appsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },

  appsCount: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
  },

  appsCaption: {
    marginTop: 4,
    color: Colors.textSecondary,
  },

  emptyState: {
    color: Colors.textSecondary,
    marginVertical: 10,
  },

  durationCard: {

  },
  appsList: {
    maxHeight: 280,
  },
  durationTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    color: Colors.text,
  },
  bottomSection: {
    marginTop: 'auto',
  },
});