// Test script to verify Supabase authentication
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xvkxccqaopbnkvwgyfjv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2a3hjY3Fhb3Bibmt2d2d5Zmp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4MjMwMTIsImV4cCI6MjA2MzM5OTAxMn0.z9UkKHDm4RPMs_2IIzEPEYzd3-sbQSF6XpxaQg3vZhU';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testDoctorSignup() {
  console.log('Testing doctor signup...');

  try {
    // Sign up a test doctor
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: 'testdoctor@hospital.com',
      password: 'Test123456!',
    });

    if (authError) {
      console.error('Auth error:', authError);
      return;
    }

    console.log('Doctor signed up:', authData.user.email);

    // Create doctor profile in User table
    if (authData.user) {
      const { error: profileError } = await supabase
        .from('User')
        .insert([{
          id: authData.user.id,
          email: authData.user.email,
          name: 'Dr. Test Doctor',
          role: 'doctor',
          created_at: new Date().toISOString()
        }]);

      if (profileError) {
        console.error('Profile creation error:', profileError);
      } else {
        console.log('Doctor profile created successfully');
      }
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

async function testDoctorLogin() {
  console.log('\nTesting doctor login...');

  try {
    // Login as doctor
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'testdoctor@hospital.com',
      password: 'Test123456!',
    });

    if (error) {
      console.error('Login error:', error);
      return;
    }

    console.log('Doctor logged in:', data.user.email);

    // Fetch doctor profile
    const { data: userData, error: userError } = await supabase
      .from('User')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (userError) {
      console.error('Profile fetch error:', userError);
    } else {
      console.log('Doctor profile:', userData);
      console.log('Role:', userData.role);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

async function testPatientSignup() {
  console.log('\nTesting patient signup...');

  try {
    // Sign up a test patient
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: 'testpatient@email.com',
      password: 'Test123456!',
    });

    if (authError) {
      console.error('Auth error:', authError);
      return;
    }

    console.log('Patient signed up:', authData.user?.email);

    // Create patient profile
    if (authData.user) {
      const { error: profileError } = await supabase
        .from('User')
        .insert([{
          id: authData.user.id,
          email: authData.user.email,
          name: 'Test Patient',
          role: 'patient',
          created_at: new Date().toISOString()
        }]);

      if (profileError) {
        console.error('Profile creation error:', profileError);
      } else {
        console.log('Patient profile created successfully');
      }

      // Create patient record
      const { error: patientError } = await supabase
        .from('patients')
        .insert([{
          name: 'Test Patient',
          email: authData.user.email,
          contact: '1234567890',
          age: 30,
          gender: 'male',
          patient_id: authData.user.id,
          created_at: new Date().toISOString()
        }]);

      if (patientError) {
        console.error('Patient record error:', patientError);
      } else {
        console.log('Patient record created successfully');
      }
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run tests
async function runTests() {
  console.log('Starting authentication tests...\n');

  // Test doctor flow
  await testDoctorSignup();
  await new Promise(resolve => setTimeout(resolve, 2000));
  await testDoctorLogin();

  // Test patient flow
  await testPatientSignup();

  console.log('\nTests completed!');
  console.log('\nYou can now test in the mobile app:');
  console.log('1. Doctor login: testdoctor@hospital.com / Test123456!');
  console.log('2. Patient login: testpatient@email.com / Test123456!');
}

runTests();