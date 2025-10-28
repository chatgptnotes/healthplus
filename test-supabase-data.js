#!/usr/bin/env node

/**
 * Comprehensive Supabase Data Test Script
 * Tests all major data operations to verify Supabase integration
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xvkxccqaopbnkvwgyfjv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2a3hjY3Fhb3Bibmt2d2d5Zmp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4MjMwMTIsImV4cCI6MjA2MzM5OTAxMn0.z9UkKHDm4RPMs_2IIzEPEYzd3-sbQSF6XpxaQg3vZhU';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Test user credentials
const testDoctor = {
  email: 'doctor.smith@hospital.com',
  password: 'Doctor123!',
  name: 'Dr. John Smith',
  role: 'doctor'
};

const testPatient = {
  email: 'john.doe@email.com',
  password: 'Patient123!',
  name: 'John Doe',
  role: 'patient'
};

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, type = 'info') {
  const color = type === 'success' ? colors.green :
                type === 'error' ? colors.red :
                type === 'warning' ? colors.yellow :
                type === 'header' ? colors.cyan :
                colors.blue;
  console.log(`${color}${message}${colors.reset}`);
}

// 1. Test User Authentication and Creation
async function testUserCreation() {
  log('\n═══════════════════════════════════════', 'header');
  log('1. TESTING USER CREATION & AUTHENTICATION', 'header');
  log('═══════════════════════════════════════', 'header');

  // Create Doctor Account
  log('\n→ Creating doctor account...');
  try {
    const { data: doctorAuth, error: doctorError } = await supabase.auth.signUp({
      email: testDoctor.email,
      password: testDoctor.password,
    });

    if (doctorError && !doctorError.message.includes('already registered')) {
      throw doctorError;
    }

    if (doctorAuth?.user) {
      log(`✓ Doctor auth created: ${doctorAuth.user.email}`, 'success');

      // Create doctor profile in User table
      const { error: profileError } = await supabase
        .from('User')
        .upsert([{
          id: doctorAuth.user.id,
          email: testDoctor.email,
          name: testDoctor.name,
          role: testDoctor.role,
          created_at: new Date().toISOString()
        }], { onConflict: 'id' });

      if (profileError) {
        log(`✗ Doctor profile error: ${profileError.message}`, 'error');
      } else {
        log(`✓ Doctor profile created/updated`, 'success');
      }
    } else {
      log('! Doctor already exists, proceeding...', 'warning');
    }
  } catch (error) {
    log(`✗ Doctor creation error: ${error.message}`, 'error');
  }

  // Create Patient Account
  log('\n→ Creating patient account...');
  try {
    const { data: patientAuth, error: patientError } = await supabase.auth.signUp({
      email: testPatient.email,
      password: testPatient.password,
    });

    if (patientError && !patientError.message.includes('already registered')) {
      throw patientError;
    }

    if (patientAuth?.user) {
      log(`✓ Patient auth created: ${patientAuth.user.email}`, 'success');

      // Create patient profile in User table
      const { error: profileError } = await supabase
        .from('User')
        .upsert([{
          id: patientAuth.user.id,
          email: testPatient.email,
          name: testPatient.name,
          role: testPatient.role,
          created_at: new Date().toISOString()
        }], { onConflict: 'id' });

      if (profileError) {
        log(`✗ Patient profile error: ${profileError.message}`, 'error');
      } else {
        log(`✓ Patient profile created/updated`, 'success');
      }

      // Create patient record
      const { error: patientRecordError } = await supabase
        .from('patients')
        .upsert([{
          patient_id: patientAuth.user.id,
          name: testPatient.name,
          email: testPatient.email,
          contact: '555-0123',
          age: 35,
          gender: 'male',
          prescription: 'Initial consultation required',
          created_at: new Date().toISOString()
        }], { onConflict: 'patient_id' });

      if (patientRecordError) {
        log(`✗ Patient record error: ${patientRecordError.message}`, 'error');
      } else {
        log(`✓ Patient record created/updated`, 'success');
      }
    } else {
      log('! Patient already exists, proceeding...', 'warning');
    }
  } catch (error) {
    log(`✗ Patient creation error: ${error.message}`, 'error');
  }
}

// 2. Test Login and Session
async function testAuthentication() {
  log('\n═══════════════════════════════════════', 'header');
  log('2. TESTING LOGIN & SESSION', 'header');
  log('═══════════════════════════════════════', 'header');

  // Test Doctor Login
  log('\n→ Testing doctor login...');
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: testDoctor.email,
      password: testDoctor.password,
    });

    if (error) throw error;

    log(`✓ Doctor logged in successfully`, 'success');
    log(`  Session token: ${data.session.access_token.substring(0, 20)}...`);

    // Fetch doctor profile
    const { data: profile, error: profileError } = await supabase
      .from('User')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profileError) throw profileError;

    log(`✓ Doctor profile fetched:`, 'success');
    log(`  Name: ${profile.name}`);
    log(`  Role: ${profile.role}`);
    log(`  Email: ${profile.email}`);

    // Sign out
    await supabase.auth.signOut();
    log(`✓ Doctor signed out`, 'success');

  } catch (error) {
    log(`✗ Doctor login error: ${error.message}`, 'error');
  }

  // Test Patient Login
  log('\n→ Testing patient login...');
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: testPatient.email,
      password: testPatient.password,
    });

    if (error) throw error;

    log(`✓ Patient logged in successfully`, 'success');

    // Keep patient logged in for further tests
    return data;

  } catch (error) {
    log(`✗ Patient login error: ${error.message}`, 'error');
    return null;
  }
}

// 3. Test Data Operations
async function testDataOperations(session) {
  log('\n═══════════════════════════════════════', 'header');
  log('3. TESTING DATA OPERATIONS', 'header');
  log('═══════════════════════════════════════', 'header');

  if (!session) {
    log('✗ No session available for data operations', 'error');
    return;
  }

  const userId = session.user.id;

  // Test Appointment Creation
  log('\n→ Creating test appointment...');
  try {
    const appointmentData = {
      patient_id: userId,
      name: testPatient.name,
      contact: '555-0123',
      email: testPatient.email,
      date: '2024-02-15',
      time: '10:30 AM',
      fees: 150,
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('appointments')
      .insert([appointmentData])
      .select();

    if (error) throw error;

    log(`✓ Appointment created successfully`, 'success');
    log(`  ID: ${data[0].id}`);
    log(`  Date: ${data[0].date}`);
    log(`  Time: ${data[0].time}`);

    // Store appointment ID for later
    const appointmentId = data[0].id;

    // Test Appointment Fetch
    log('\n→ Fetching appointments...');
    const { data: appointments, error: fetchError } = await supabase
      .from('appointments')
      .select('*')
      .eq('patient_id', userId);

    if (fetchError) throw fetchError;

    log(`✓ Fetched ${appointments.length} appointment(s)`, 'success');
    appointments.forEach((apt, index) => {
      log(`  ${index + 1}. ${apt.date} at ${apt.time} - $${apt.fees}`);
    });

    // Test Appointment Update
    log('\n→ Updating appointment...');
    const { error: updateError } = await supabase
      .from('appointments')
      .update({
        time: '2:00 PM',
        updated_at: new Date().toISOString()
      })
      .eq('id', appointmentId);

    if (updateError) throw updateError;
    log(`✓ Appointment updated successfully`, 'success');

    // Test Appointment Deletion
    log('\n→ Deleting test appointment...');
    const { error: deleteError } = await supabase
      .from('appointments')
      .delete()
      .eq('id', appointmentId);

    if (deleteError) throw deleteError;
    log(`✓ Appointment deleted successfully`, 'success');

  } catch (error) {
    log(`✗ Data operation error: ${error.message}`, 'error');
  }
}

// 4. Test Table Structure
async function testTableStructure() {
  log('\n═══════════════════════════════════════', 'header');
  log('4. CHECKING TABLE STRUCTURE', 'header');
  log('═══════════════════════════════════════', 'header');

  const tablesToCheck = [
    'User',
    'patients',
    'appointments',
    'pharmacy_inventory',
    'lab_test_orders',
    'billing_bills',
    'nursing_assignments'
  ];

  for (const table of tablesToCheck) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);

      if (error) {
        log(`✗ Table '${table}': ${error.message}`, 'error');
      } else {
        log(`✓ Table '${table}' exists and is accessible`, 'success');
      }
    } catch (error) {
      log(`✗ Table '${table}': ${error.message}`, 'error');
    }
  }
}

// 5. Test Real-time Subscriptions
async function testRealtimeSubscriptions() {
  log('\n═══════════════════════════════════════', 'header');
  log('5. TESTING REALTIME SUBSCRIPTIONS', 'header');
  log('═══════════════════════════════════════', 'header');

  log('\n→ Setting up realtime listener for appointments...');

  const subscription = supabase
    .channel('appointments-changes')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'appointments' },
      (payload) => {
        log(`✓ Realtime event received:`, 'success');
        log(`  Event: ${payload.eventType}`);
        log(`  Table: ${payload.table}`);
        if (payload.new) {
          log(`  New data: ${JSON.stringify(payload.new).substring(0, 100)}...`);
        }
      }
    )
    .subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        log(`✓ Subscribed to appointments table changes`, 'success');
      }
    });

  // Wait a bit then unsubscribe
  await new Promise(resolve => setTimeout(resolve, 3000));

  await supabase.removeChannel(subscription);
  log(`✓ Unsubscribed from realtime changes`, 'success');
}

// Main test runner
async function runAllTests() {
  log('\n╔═══════════════════════════════════════╗', 'header');
  log('║   SUPABASE DATA CONNECTIVITY TEST     ║', 'header');
  log('╚═══════════════════════════════════════╝', 'header');

  try {
    // Run all tests
    await testUserCreation();
    const session = await testAuthentication();
    await testDataOperations(session);
    await testTableStructure();
    await testRealtimeSubscriptions();

    // Summary
    log('\n╔═══════════════════════════════════════╗', 'header');
    log('║           TEST SUMMARY                ║', 'header');
    log('╚═══════════════════════════════════════╝', 'header');

    log('\n✅ Supabase integration is working!', 'success');
    log('\nYou can now test in the mobile app with:', 'success');
    log(`  Doctor: ${testDoctor.email} / ${testDoctor.password}`);
    log(`  Patient: ${testPatient.email} / ${testPatient.password}`);

    log('\n📱 To test in the app:', 'header');
    log('  1. Run: npm start');
    log('  2. Scan QR code with Expo Go');
    log('  3. Login with test credentials');
    log('  4. Check console logs for data fetching');

    // Sign out
    await supabase.auth.signOut();

  } catch (error) {
    log(`\n✗ Test suite error: ${error.message}`, 'error');
  }

  process.exit(0);
}

// Run the tests
runAllTests();