import 'react-native-url-polyfill/auto';
import React from 'react';
import { StyleSheet, View, AppRegistry, TouchableOpacity } from 'react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';

import AppointmentReducer from './store/reducers/appointmentReducer';
import AuthReducer from './store/reducers/AuthReducer';
import PatientReducer from './store/reducers/PatientReducer';
import PharmacyReducer from './store/reducers/PharmacyReducer';
import LabReducer from './store/reducers/LabReducer';
import BillingReducer from './store/reducers/BillingReducer';
import NursingReducer from './store/reducers/NursingReducer';

// Import your screens
import ProfileScreen from './Screens/chooseProfileScreen';
import AuthScreen from './Screens/AuthScreen';
import SignUpScreen from './Screens/SignUpScreen';
import HomeScreen from './Screens/HomeScreen';
import CreatePatientProfile from './Screens/CreatePatientProfile';
import Appointments from './Screens/Appointments';
import AppointmentsList from './Screens/AppointmentList';

// Import specialized dashboard screens
import PharmacyDashboard from './Screens/PharmacyDashboard';
import NurseDashboard from './Screens/NurseDashboard';
import LabDashboard from './Screens/LabDashboard';
import BillingDashboard from './Screens/BillingDashboard';
import ReceptionDashboard from './Screens/ReceptionDashboard';
import AdminDashboard from './Screens/AdminDashboard';

// Import Patient Registration module screens
import PatientRegistration from './Screens/PatientRegistration';
import PatientSearch from './Screens/PatientSearch';
import PatientDetails from './Screens/PatientDetails';

// Import Pharmacy module screens
import PharmacyInventory from './Screens/PharmacyInventory';
import PrescriptionProcessing from './Screens/PrescriptionProcessing';
import SupplierManagement from './Screens/SupplierManagement';

// Import Pathology module screens
import PathologyTestManagement from './Screens/PathologyTestManagement';
import LabResults from './Screens/LabResults';

// Import Radiology module screens
import RadiologyManagement from './Screens/RadiologyManagement';
import RadiologyImageViewer from './Screens/RadiologyImageViewer';

// Import Nursing module screens
import NursingManagement from './Screens/NursingManagement';

const store = configureStore({
  reducer: {
    appointment: AppointmentReducer,
    auth: AuthReducer,
    patient: PatientReducer,
    pharmacy: PharmacyReducer,
    lab: LabReducer,
    billing: BillingReducer,
    nursing: NursingReducer,
  },
});

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#6366f1',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="chooseProfileScreen"
        component={ProfileScreen}
        options={{
          headerShown: false // Hide header for landing page
        }}
      />
      <Stack.Screen
        name="login"
        component={AuthScreen}
        options={{
          title: 'Sign In'
        }}
      />
      <Stack.Screen
        name="signup"
        component={SignUpScreen}
        options={{ title: 'Sign Up' }}
      />
    </Stack.Navigator>
  );
}

function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#6366f1',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen
        name="home"
        component={HomeScreen}
        options={{
          headerShown: false // Hide header for main home screen
        }}
      />
      <Stack.Screen
        name="appointments"
        component={Appointments}
        options={{ title: 'Book Appointment' }}
      />
      <Stack.Screen
        name="appointmentsList"
        component={AppointmentsList}
        options={{ title: 'My Appointments' }}
      />

      {/* Specialized Dashboard Screens */}
      <Stack.Screen
        name="PharmacyDashboard"
        component={PharmacyDashboard}
        options={({ navigation }) => ({
          title: 'Pharmacy Dashboard',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate('auth', { screen: 'chooseProfileScreen' })}
              style={{ marginLeft: 15 }}
            >
              <MaterialIcons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="NurseDashboard"
        component={NurseDashboard}
        options={({ navigation }) => ({
          title: 'Nursing Dashboard',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate('auth', { screen: 'chooseProfileScreen' })}
              style={{ marginLeft: 15 }}
            >
              <MaterialIcons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="LabDashboard"
        component={LabDashboard}
        options={({ navigation }) => ({
          title: 'Laboratory Dashboard',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate('auth', { screen: 'chooseProfileScreen' })}
              style={{ marginLeft: 15 }}
            >
              <MaterialIcons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="BillingDashboard"
        component={BillingDashboard}
        options={({ navigation }) => ({
          title: 'Billing Dashboard',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate('auth', { screen: 'chooseProfileScreen' })}
              style={{ marginLeft: 15 }}
            >
              <MaterialIcons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="ReceptionDashboard"
        component={ReceptionDashboard}
        options={({ navigation }) => ({
          title: 'Reception Dashboard',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate('auth', { screen: 'chooseProfileScreen' })}
              style={{ marginLeft: 15 }}
            >
              <MaterialIcons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="AdminDashboard"
        component={AdminDashboard}
        options={({ navigation }) => ({
          title: 'Administrator Dashboard',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate('auth', { screen: 'chooseProfileScreen' })}
              style={{ marginLeft: 15 }}
            >
              <MaterialIcons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
          ),
        })}
      />

      {/* Patient Registration Module Screens */}
      <Stack.Screen
        name="PatientRegistration"
        component={PatientRegistration}
        options={{ title: 'Patient Registration' }}
      />
      <Stack.Screen
        name="PatientSearch"
        component={PatientSearch}
        options={{ title: 'Search Patients' }}
      />
      <Stack.Screen
        name="PatientDetails"
        component={PatientDetails}
        options={{ title: 'Patient Details' }}
      />

      {/* Pharmacy Module Screens */}
      <Stack.Screen
        name="PharmacyInventory"
        component={PharmacyInventory}
        options={{ title: 'Pharmacy Inventory' }}
      />
      <Stack.Screen
        name="PrescriptionProcessing"
        component={PrescriptionProcessing}
        options={{ title: 'Process Prescriptions' }}
      />
      <Stack.Screen
        name="SupplierManagement"
        component={SupplierManagement}
        options={{ title: 'Supplier Management' }}
      />

      {/* Pathology Module Screens */}
      <Stack.Screen
        name="PathologyTestManagement"
        component={PathologyTestManagement}
        options={{ title: 'Pathology Tests' }}
      />
      <Stack.Screen
        name="LabResults"
        component={LabResults}
        options={{ title: 'Lab Results' }}
      />

      {/* Radiology Module Screens */}
      <Stack.Screen
        name="RadiologyManagement"
        component={RadiologyManagement}
        options={{ title: 'Radiology Management' }}
      />
      <Stack.Screen
        name="RadiologyImageViewer"
        component={RadiologyImageViewer}
        options={{ title: 'View Radiology Images' }}
      />

      {/* Nursing Module Screens */}
      <Stack.Screen
        name="NursingManagement"
        component={NursingManagement}
        options={{ title: 'Nursing Management' }}
      />
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

