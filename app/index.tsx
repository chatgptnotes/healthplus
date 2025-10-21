import { Redirect } from 'expo-router';

export default function AppIndex() {
  // Check if user is authenticated here
  // For now, redirect to auth
  return <Redirect href="/(auth)" />;
}