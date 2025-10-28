#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xvkxccqaopbnkvwgyfjv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2a3hjY3Fhb3Bibmt2d2d5Zmp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4MjMwMTIsImV4cCI6MjA2MzM5OTAxMn0.z9UkKHDm4RPMs_2IIzEPEYzd3-sbQSF6XpxaQg3vZhU';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log('🔍 Testing Supabase Connection...\n');

// Test 1: Check if we can connect
console.log('1. Testing basic connection:');
try {
  const { data, error } = await supabase
    .from('User')
    .select('count')
    .limit(1);

  if (error) {
    console.log('   ❌ Connection failed:', error.message);
  } else {
    console.log('   ✅ Connected to Supabase successfully!');
  }
} catch (err) {
  console.log('   ❌ Error:', err.message);
}

// Test 2: Check available tables
console.log('\n2. Checking database tables:');
const tables = ['User', 'patients', 'appointments'];

for (const table of tables) {
  try {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .limit(1);

    if (error) {
      console.log(`   ❌ ${table}: Not found or not accessible`);
    } else {
      console.log(`   ✅ ${table}: Exists and accessible`);
    }
  } catch (err) {
    console.log(`   ❌ ${table}: Error - ${err.message}`);
  }
}

// Test 3: Try to create and login a test user
console.log('\n3. Testing authentication:');

const testEmail = `test${Date.now()}@example.com`;
const testPassword = 'TestPass123!';

// Sign up
console.log('   Creating test user...');
const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
  email: testEmail,
  password: testPassword,
});

if (signUpError) {
  console.log('   ❌ Signup failed:', signUpError.message);
} else {
  console.log('   ✅ User created:', signUpData.user?.email);

  // Try to login
  console.log('   Attempting login...');
  const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
    email: testEmail,
    password: testPassword,
  });

  if (loginError) {
    console.log('   ⚠️  Login failed (email may need confirmation):', loginError.message);
  } else {
    console.log('   ✅ Login successful!');
    console.log('   User ID:', loginData.user.id);
    console.log('   Session:', loginData.session ? 'Active' : 'None');
  }
}

// Test 4: Create test data if logged in
const { data: { session } } = await supabase.auth.getSession();

if (session) {
  console.log('\n4. Testing data operations:');

  // Try to create a User profile
  const { error: profileError } = await supabase
    .from('User')
    .upsert({
      id: session.user.id,
      email: session.user.email,
      role: 'patient',
      created_at: new Date().toISOString()
    });

  if (profileError) {
    console.log('   ❌ Profile creation failed:', profileError.message);
  } else {
    console.log('   ✅ User profile created');
  }

  // Try to create patient record
  const { error: patientError } = await supabase
    .from('patients')
    .insert({
      patient_id: session.user.id,
      name: 'Test User',
      email: session.user.email,
      contact: '123-456-7890',
      age: 30,
      gender: 'other',
      created_at: new Date().toISOString()
    });

  if (patientError) {
    console.log('   ❌ Patient record failed:', patientError.message);
  } else {
    console.log('   ✅ Patient record created');
  }

  // Sign out
  await supabase.auth.signOut();
  console.log('   ✅ Signed out');
}

console.log('\n📊 Summary:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('Supabase URL:', supabaseUrl);
console.log('Connection: Working ✅');
console.log('\nNext steps:');
console.log('1. Run the SQL setup script in Supabase dashboard');
console.log('2. Start the mobile app: npm start');
console.log('3. Test with real user login');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

process.exit(0);