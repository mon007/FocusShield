import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  FlatList,
  Image,
} from 'react-native';

import {
  saveFocusListApps,
  saveOnboardingStatus,
} from '../storage/storage';

import FocusBlocker from '../native/FocusBlocker';
import { Colors } from '../theme/colors';

export default function OnboardingScreen({
  navigation,
}: any) {
  const [apps, setApps] = useState<any[]>([]);
const [step, setStep] = useState(0);
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
if (step === 0) {
  return (
    <View style={styles.introContainer}>
      <Image
        source={require('../assets/focus_shield_logo.png')}
        style={styles.logo}
      />

      <Text style={styles.heroTitle}>
        Focus Better.
      </Text>

      <Text style={styles.heroSubtitle}>
        Your attention matters.
      </Text>

      <View style={styles.dots}>
        <View style={styles.activeDot} />
        <View style={styles.dot} />
        <View style={styles.dot} />
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => setStep(1)}>
        <Text style={styles.buttonText}>
          Next
        </Text>
      </TouchableOpacity>
    </View>
  );
}

if (step === 1) {
  return (
    <View style={styles.introContainer}>
      <Image
        source={require('../assets/focus_shield_logo.png')}
        style={styles.logo}
      /> 
      <Text style={styles.heroTitle}>
        Stay in Control.
      </Text>

      <Text style={styles.heroSubtitle}>
        Distractions can wait.
      </Text>

      <View style={styles.dots}>
        <View style={styles.dot} />
        <View style={styles.activeDot} />
        <View style={styles.dot} />
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => setStep(2)}>
        <Text style={styles.buttonText}>
          Next
        </Text>
      </TouchableOpacity>
    </View>
  );
}
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Build your focus list. 
      </Text>

      <Text style={styles.subtitle}>
         Select apps to block during focus sessions
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
          Start Your Journey
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
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    marginTop: 20,
  },

  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
  introContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#F8F7F4',
  paddingHorizontal: 32,
},

logo: {
  width: 140,
  height: 140,
  resizeMode: 'contain',
  marginBottom: 40,
},

heroTitle: {
  fontSize: 36,
  fontWeight: '700',
  color: Colors.text,
  textAlign: 'center',
},

heroSubtitle: {
  marginTop: 12,
  fontSize: 18,
  color: '#666',
  textAlign: 'center',
},

dots: {
  flexDirection: 'row',
  marginTop: 40,
  marginBottom: 40,
},

dot: {
  width: 8,
  height: 8,
  borderRadius: 4,
  backgroundColor: '#D1D5DB',
  marginHorizontal: 4,
},

activeDot: {
  width: 24,
  height: 8,
  borderRadius: 4,
  backgroundColor: '#39D98A',
  marginHorizontal: 4,
},
});