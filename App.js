import 'react-native-url-polyfill/auto';
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, AppRegistry, TouchableOpacity } from 'react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Import custom splash screen component
import HopeHospitalSplash from './components/HopeHospitalSplash';

import AppointmentReducer from './store/reducers/appointmentReducer';
import AuthReducer from './store/reducers/AuthReducer';
import PatientReducer from './store/reducers/PatientReducer';
import PharmacyReducer from './store/reducers/PharmacyReducer';
import LabReducer from './store/reducers/LabReducer';
import BillingReducer from './store/reducers/BillingReducer';
import NursingReducer from './store/reducers/NursingReducer';
import HospitalMetricsReducer from './store/reducers/HospitalMetricsReducer';
import NotificationReducer from './store/reducers/NotificationReducer';

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

// Import Patient Feedback & Digital Consent module screens
import PatientFeedback from './Screens/PatientFeedback';
import DigitalConsent from './Screens/DigitalConsent';
import FeedbackAnalytics from './Screens/FeedbackAnalytics';

// Import Quality Management & Leadership module screens
import MorningHuddle from './Screens/MorningHuddle';
import MarketingDashboard from './Screens/MarketingDashboard';
import LeadershipTeam from './Screens/LeadershipTeam';
import QualityDashboard from './Screens/QualityDashboard';
import NABHAccreditation from './Screens/NABHAccreditation';
import SOPManagement from './Screens/SOPManagement';

// Import Occupancy Dashboard and Notification System
import OccupancyDashboard from './Screens/OccupancyDashboard';
import StaffTodoManager from './Screens/StaffTodoManager';
import NotificationCenter from './Screens/NotificationCenter';

// Import SOP-based modules
import DailyAccountingSOP from './Screens/DailyAccountingSOP';
import PatientWiseReconciliation from './Screens/PatientWiseReconciliation';
import StaffTrainingModule from './Screens/StaffTrainingModule';
import EmergencyContactsDirectory from './Screens/EmergencyContactsDirectory';
import SecurityStaffManagement from './Screens/SecurityStaffManagement';
import JustDialLeadManagement from './Screens/JustDialLeadManagement';
import OTTechnicianModule from './Screens/OTTechnicianModule';
import LeadershipActionPoints from './Screens/LeadershipActionPoints';
import MorningHuddleEnhanced from './Screens/MorningHuddleEnhanced';

const store = configureStore({
  reducer: {
    appointment: AppointmentReducer,
    auth: AuthReducer,
    patient: PatientReducer,
    pharmacy: PharmacyReducer,
    lab: LabReducer,
    billing: BillingReducer,
    nursing: NursingReducer,
    hospitalMetrics: HospitalMetricsReducer,
    notifications: NotificationReducer,
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

      {/* Patient Feedback & Digital Consent Module Screens */}
      <Stack.Screen
        name="PatientFeedback"
        component={PatientFeedback}
        options={{ title: 'Patient Feedback' }}
      />
      <Stack.Screen
        name="DigitalConsent"
        component={DigitalConsent}
        options={{ title: 'Digital Consent' }}
      />
      <Stack.Screen
        name="FeedbackAnalytics"
        component={FeedbackAnalytics}
        options={{ title: 'Feedback Analytics' }}
      />

      {/* Quality Management & Leadership Module Screens */}
      <Stack.Screen
        name="MorningHuddle"
        component={MorningHuddle}
        options={{ title: 'Morning Huddle' }}
      />
      <Stack.Screen
        name="MarketingDashboard"
        component={MarketingDashboard}
        options={{ title: 'Marketing Dashboard' }}
      />
      <Stack.Screen
        name="LeadershipTeam"
        component={LeadershipTeam}
        options={{ title: 'Leadership Team' }}
      />
      <Stack.Screen
        name="QualityDashboard"
        component={QualityDashboard}
        options={{ title: 'Quality Dashboard' }}
      />
      <Stack.Screen
        name="NABHAccreditation"
        component={NABHAccreditation}
        options={{ title: 'NABH Accreditation' }}
      />
      <Stack.Screen
        name="SOPManagement"
        component={SOPManagement}
        options={{ title: 'SOPs & Training' }}
      />
      <Stack.Screen
        name="OccupancyDashboard"
        component={OccupancyDashboard}
        options={{ title: 'Hospital Occupancy & KPIs' }}
      />
      <Stack.Screen
        name="StaffTodoManager"
        component={StaffTodoManager}
        options={{ title: 'My Tasks' }}
      />
      <Stack.Screen
        name="NotificationCenter"
        component={NotificationCenter}
        options={{ title: 'Notifications' }}
      />

      {/* SOP-based Module Screens */}
      <Stack.Screen
        name="DailyAccountingSOP"
        component={DailyAccountingSOP}
        options={{ title: 'Daily Accounting SOP' }}
      />
      <Stack.Screen
        name="PatientWiseReconciliation"
        component={PatientWiseReconciliation}
        options={{ title: 'Patient-wise Reconciliation' }}
      />
      <Stack.Screen
        name="StaffTrainingModule"
        component={StaffTrainingModule}
        options={{ title: 'Staff Training & Development' }}
      />
      <Stack.Screen
        name="EmergencyContactsDirectory"
        component={EmergencyContactsDirectory}
        options={{ title: 'Emergency Contacts & Intercom' }}
      />
      <Stack.Screen
        name="SecurityStaffManagement"
        component={SecurityStaffManagement}
        options={{ title: 'Security Staff Management' }}
      />
      <Stack.Screen
        name="JustDialLeadManagement"
        component={JustDialLeadManagement}
        options={{ title: 'JustDial Lead Management' }}
      />
      <Stack.Screen
        name="OTTechnicianModule"
        component={OTTechnicianModule}
        options={{ title: 'OT Technician Management' }}
      />
      <Stack.Screen
        name="LeadershipActionPoints"
        component={LeadershipActionPoints}
        options={{ title: 'Leadership Action Points' }}
      />
      <Stack.Screen
        name="MorningHuddleEnhanced"
        component={MorningHuddleEnhanced}
        options={{ title: 'Enhanced Morning Huddle' }}
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

// Keep splash screen visible while app is loading
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [isAppReady, setIsAppReady] = useState(false);
  const [showCustomSplash, setShowCustomSplash] = useState(true);

  useEffect(() => {
    async function prepareApp() {
      try {
        // Pre-load fonts, make any API calls you need to do here
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate loading time

        // Tell the application to render
        setIsAppReady(true);
      } catch (e) {
        console.warn(e);
      }
    }

    prepareApp();
  }, []);

  useEffect(() => {
    if (isAppReady) {
      // Hide the system splash screen once the app is ready
      SplashScreen.hideAsync();
    }
  }, [isAppReady]);

  const onCustomSplashFinish = () => {
    setShowCustomSplash(false);
  };

  if (!isAppReady || showCustomSplash) {
    return (
      <SafeAreaProvider>
        <HopeHospitalSplash onFinish={isAppReady ? onCustomSplashFinish : null} />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="auth" component={AuthStack} />
            <Stack.Screen name="main" component={TabNavigator} />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    </SafeAreaProvider>
  );
}

// Register the app component with AppRegistry
AppRegistry.registerComponent('main', () => App);

