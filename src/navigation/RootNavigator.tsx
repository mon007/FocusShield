import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SplashScreen from '../screens/SplashScreen';
import HomeScreen from '../screens/HomeScreen';
import FocusScreen from '../screens/FocusScreen';
import { RootStackParamList } from '../types';

// const Stack = createNativeStackNavigator();
const Stack =
  createNativeStackNavigator<RootStackParamList>();
export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Splash"
  component={SplashScreen}
/>

<Stack.Screen
  name="Home"
  component={HomeScreen}
/>

<Stack.Screen
  name="Focus"
  component={FocusScreen}
  options={{
    headerBackVisible: false,
    gestureEnabled: false,
  }}
/>
       
      </Stack.Navigator>
    </NavigationContainer>
  );
}