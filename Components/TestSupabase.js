import React, { useState, useEffect } from 'react';
import { View, Text, Button, ScrollView, StyleSheet, Alert } from 'react-native';
import { supabase } from '../lib/supabase';

const TestSupabase = () => {
  const [status, setStatus] = useState('Initializing...');
  const [userData, setUserData] = useState(null);
  const [patientData, setPatientData] = useState(null);
  const [testResults, setTestResults] = useState([]);

  const addTestResult = (test, result, isSuccess = true) => {
    setTestResults(prev => [...prev, { test, result, isSuccess }]);
  };

  // Test 1: Check Supabase Connection
  const testConnection = async () => {
    try {
      const { data, error } = await supabase
        .from('User')
        .select('count')
        .limit(1);

      if (error) throw error;
      addTestResult('Connection', 'Connected to Supabase ✓', true);
      return true;
    } catch (error) {
      addTestResult('Connection', `Failed: ${error.message}`, false);
      return false;
    }
  };

  // Test 2: Check Current Session
  const testSession = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) throw error;

      if (session) {
        addTestResult('Session', `Active for: ${session.user.email}`, true);
        setUserData(session.user);
        return session;
      } else {
        addTestResult('Session', 'No active session', false);
        return null;
      }
    } catch (error) {
      addTestResult('Session', `Error: ${error.message}`, false);
      return null;
    }
  };

  // Test 3: Fetch User Profile
  const testUserProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('User')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      addTestResult('User Profile', `Found: ${data.email} (${data.role || 'no role'})`, true);
      return data;
    } catch (error) {
      addTestResult('User Profile', `Not found: ${error.message}`, false);
      return null;
    }
  };

  // Test 4: Fetch Patient Data
  const testPatientData = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('patient_id', userId);

      if (error) throw error;

      if (data && data.length > 0) {
        addTestResult('Patient Data', `Found ${data.length} record(s)`, true);
        setPatientData(data[0]);
      } else {
        addTestResult('Patient Data', 'No patient records', false);
      }
      return data;
    } catch (error) {
      addTestResult('Patient Data', `Error: ${error.message}`, false);
      return null;
    }
  };

  // Test 5: Fetch Appointments
  const testAppointments = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('patient_id', userId);

      if (error) throw error;

      addTestResult('Appointments', `Found ${data?.length || 0} appointment(s)`, true);
      return data;
    } catch (error) {
      addTestResult('Appointments', `Table not found or error: ${error.message}`, false);
      return null;
    }
  };

  // Test 6: Create Test Appointment
  const testCreateData = async (userId) => {
    try {
      const testAppointment = {
        patient_id: userId,
        name: 'Test Patient',
        contact: '555-TEST',
        email: userData?.email || 'test@example.com',
        date: new Date().toISOString().split('T')[0],
        time: '10:00 AM',
        fees: 100,
        created_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('appointments')
        .insert([testAppointment])
        .select();

      if (error) throw error;

      addTestResult('Create Data', `Created appointment ID: ${data[0]?.id}`, true);

      // Clean up - delete the test appointment
      if (data[0]?.id) {
        await supabase
          .from('appointments')
          .delete()
          .eq('id', data[0].id);
      }

      return true;
    } catch (error) {
      addTestResult('Create Data', `Failed: ${error.message}`, false);
      return false;
    }
  };

  // Run all tests
  const runAllTests = async () => {
    setTestResults([]);
    setStatus('Running tests...');

    // Test connection
    const connected = await testConnection();
    if (!connected) {
      setStatus('Connection failed');
      return;
    }

    // Check session
    const session = await testSession();
    if (session) {
      // Test authenticated operations
      await testUserProfile(session.user.id);
      await testPatientData(session.user.id);
      await testAppointments(session.user.id);

      // Only test create if appointments table exists
      if (!testResults.some(r => r.test === 'Appointments' && !r.isSuccess)) {
        await testCreateData(session.user.id);
      }
    }

    setStatus('Tests completed');
  };

  // Auto-run tests on mount
  useEffect(() => {
    runAllTests();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Supabase Data Test</Text>
        <Text style={styles.status}>Status: {status}</Text>
      </View>

      {userData && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current User</Text>
          <Text style={styles.info}>Email: {userData.email}</Text>
          <Text style={styles.info}>ID: {userData.id}</Text>
        </View>
      )}

      {patientData && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Patient Data</Text>
          <Text style={styles.info}>Name: {patientData.name}</Text>
          <Text style={styles.info}>Contact: {patientData.contact}</Text>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Test Results</Text>
        {testResults.map((result, index) => (
          <View key={index} style={styles.testResult}>
            <Text style={[
              styles.testText,
              { color: result.isSuccess ? 'green' : 'red' }
            ]}>
              {result.test}: {result.result}
            </Text>
          </View>
        ))}
      </View>

      <Button title="Re-run Tests" onPress={runAllTests} />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <Button
          title="Test Login"
          onPress={async () => {
            try {
              const { data, error } = await supabase.auth.signInWithPassword({
                email: 'test@example.com',
                password: 'Test123456!'
              });
              Alert.alert(
                error ? 'Login Failed' : 'Login Success',
                error ? error.message : `Logged in as ${data.user.email}`
              );
              if (!error) runAllTests();
            } catch (err) {
              Alert.alert('Error', err.message);
            }
          }}
        />
        <View style={{ marginTop: 10 }}>
          <Button
            title="Sign Out"
            onPress={async () => {
              await supabase.auth.signOut();
              Alert.alert('Signed Out', 'You have been signed out');
              runAllTests();
            }}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  status: {
    fontSize: 16,
    color: '#666',
  },
  section: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  info: {
    fontSize: 14,
    marginBottom: 5,
    color: '#333',
  },
  testResult: {
    paddingVertical: 5,
  },
  testText: {
    fontSize: 14,
  },
});

export default TestSupabase;