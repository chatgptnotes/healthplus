import 'react-native-url-polyfill/auto';
import React from 'react';
import { StyleSheet, View, AppRegistry } from 'react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AntDesign } from '@expo/vector-icons';

import AppointmentReducer from './store/reducers/appointmentReducer';
import AuthReducer from './store/reducers/AuthReducer';
import PatientReducer from './store/reducers/PatientReducer';

// Import your screens
import ProfileScreen from './Screens/chooseProfileScreen';
import AuthScreen from './Screens/AuthScreen';
import SignUpScreen from './Screens/SignUpScreen';
import HomeScreen from './Screens/HomeScreen';
import CreatePatientProfile from './Screens/CreatePatientProfile';
import Appointments from './Screens/Appointments';
import AppointmentsList from './Screens/AppointmentList';

const store = configureStore({
  reducer: {
    appointment: AppointmentReducer,
    auth: AuthReducer,
    patient: PatientReducer,
  },
});

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="chooseProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="login" component={AuthScreen} />
      <Stack.Screen name="signup" component={SignUpScreen} />
    </Stack.Navigator>
  );
}

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="home" component={HomeScreen} />
      <Stack.Screen name="appointments" component={Appointments} />
      <Stack.Screen name="appointmentsList" component={AppointmentsList} />
    </Stack.Navigator>
  );
}

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: 'tomato',
      }}>
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <AntDesign name="home" size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={CreatePatientProfile}
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <AntDesign name="user" size={24} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="auth" component={AuthStack} />
          <Stack.Screen name="main" component={TabNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

// Register the app component with AppRegistry
AppRegistry.registerComponent('main', () => App);

