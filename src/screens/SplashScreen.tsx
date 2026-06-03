import React, {useEffect} from 'react';
import {
  View,
  ActivityIndicator,
} from 'react-native';

import {NativeStackScreenProps} from '@react-navigation/native-stack';

import {RootStackParamList} from '../navigation/types';

import {getSession} from '../storage/storage';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'Splash'
>;

export default function SplashScreen({
  navigation,
}: Props) {
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    const session = await getSession();

   if (
  session &&
  session.endTime > Date.now()
) {
  navigation.replace('Focus');
} else {
  navigation.replace('Home');
}
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <ActivityIndicator size="large" />
    </View>
  );
}