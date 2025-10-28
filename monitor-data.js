#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xvkxccqaopbnkvwgyfjv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2a3hjY3Fhb3Bibmt2d2d5Zmp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4MjMwMTIsImV4cCI6MjA2MzM5OTAxMn0.z9UkKHDm4RPMs_2IIzEPEYzd3-sbQSF6XpxaQg3vZhU';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log('\n📊 SUPABASE DATA MONITOR');
console.log('═══════════════════════════════════════\n');

async function monitorData() {
  // 1. Check Users
  console.log('👤 USERS in auth.users and User table:');
  console.log('─────────────────────────────────');

  try {
    // Get all User profiles
    const { data: users, error } = await supabase
      .from('User')
      .select('*');

    if (error) {
      console.log('❌ Error fetching users:', error.message);
    } else if (users && users.length > 0) {
      console.log(`Found ${users.length} user(s):\n`);
      users.forEach((user, index) => {
        console.log(`  ${index + 1}. Email: ${user.email}`);
        console.log(`     Role: ${user.role || 'not set'}`);
        console.log(`     Name: ${user.name || 'not set'}`);
        console.log(`     ID: ${user.id}`);
        console.log('');
      });
    } else {
      console.log('No users found in User table');
    }
  } catch (err) {
    console.log('❌ Error:', err.message);
  }

  // 2. Check Patients
  console.log('\n🏥 PATIENTS:');
  console.log('─────────────────────────────────');

  try {
    const { data: patients, error } = await supabase
      .from('patients')
      .select('*');

    if (error) {
      console.log('❌ Error fetching patients:', error.message);
    } else if (patients && patients.length > 0) {
      console.log(`Found ${patients.length} patient(s):\n`);
      patients.forEach((patient, index) => {
        console.log(`  ${index + 1}. Name: ${patient.name}`);
        console.log(`     Email: ${patient.email}`);
        console.log(`     Contact: ${patient.contact}`);
        console.log(`     Age: ${patient.age}`);
        console.log(`     Gender: ${patient.gender}`);
        console.log('');
      });
    } else {
      console.log('No patients found');
    }
  } catch (err) {
    console.log('❌ Error:', err.message);
  }

  // 3. Check Appointments
  console.log('\n📅 APPOINTMENTS:');
  console.log('─────────────────────────────────');

  try {
    const { data: appointments, error } = await supabase
      .from('appointments')
      .select('*');

    if (error) {
      console.log('❌ Error:', error.message);
      console.log('   (Table may not exist yet)');
    } else if (appointments && appointments.length > 0) {
      console.log(`Found ${appointments.length} appointment(s):\n`);
      appointments.forEach((apt, index) => {
        console.log(`  ${index + 1}. Date: ${apt.date}`);
        console.log(`     Time: ${apt.time}`);
        console.log(`     Patient: ${apt.name}`);
        console.log(`     Fees: $${apt.fees}`);
        console.log('');
      });
    } else {
      console.log('No appointments found');
    }
  } catch (err) {
    console.log('❌ Error:', err.message);
  }

  // 4. Check Table List
  console.log('\n📋 AVAILABLE TABLES:');
  console.log('─────────────────────────────────');

  const tablesToCheck = [
    'User',
    'patients',
    'appointments',
    'pharmacy_inventory',
    'pharmacy_prescriptions',
    'lab_test_orders',
    'billing_bills',
    'nursing_assignments'
  ];

  for (const table of tablesToCheck) {
    try {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.log(`  ❌ ${table}: Not found`);
      } else {
        console.log(`  ✅ ${table}: Exists (${count || 0} records)`);
      }
    } catch (err) {
      console.log(`  ❌ ${table}: Error`);
    }
  }

  console.log('\n═══════════════════════════════════════');
  console.log('Monitor complete. Data summary above.');
  console.log('═══════════════════════════════════════\n');
}

// Run monitor
monitorData().then(() => process.exit(0));