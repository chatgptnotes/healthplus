import { Stack } from 'expo-router';
import { Provider, useDispatch } from 'react-redux';
import { combineReducers, createStore, applyMiddleware } from 'redux';
import { useEffect } from 'react';
import AppointmentReducer from '../store/reducers/appointmentReducer';
import AuthReducer from '../store/reducers/AuthReducer';
import PatientReducer from '../store/reducers/PatientReducer';
import PharmacyReducer from '../store/reducers/PharmacyReducer';
import LabReducer from '../store/reducers/LabReducer';
import BillingReducer from '../store/reducers/BillingReducer';
import NursingReducer from '../store/reducers/NursingReducer';
import DocumentReducer from '../store/reducers/DocumentReducer';
import HospitalMetricsReducer from '../store/reducers/HospitalMetricsReducer';
import NotificationReducer from '../store/reducers/NotificationReducer';
import ReduxThunk from 'redux-thunk';
import { supabase } from '../lib/supabase';
import { checkSession } from '../store/actions/AuthActions';

const rootReducer = combineReducers({
  appointment: AppointmentReducer,
  auth: AuthReducer,
  patient: PatientReducer,
  pharmacy: PharmacyReducer,
  lab: LabReducer,
  billing: BillingReducer,
  nursing: NursingReducer,
  documents: DocumentReducer,
  hospitalMetrics: HospitalMetricsReducer,
  notifications: NotificationReducer,
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

function AuthSessionProvider({ children }) {
  useEffect(() => {
    // Check for existing session on app load
    store.dispatch(checkSession());

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        // Fetch user role when signed in
        const { data: userData } = await supabase
          .from('User')
          .select('*')
          .eq('id', session.user.id)
          .single();

        store.dispatch({
          type: 'LOGIN',
          token: session.access_token,
          userId: session.user.id,
          email: session.user.email,
          role: userData?.role || 'patient'
        });
      } else if (event === 'SIGNED_OUT') {
        store.dispatch({ type: 'LOGOUT' });
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <AuthSessionProvider>
        <Stack>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </AuthSessionProvider>
    </Provider>
  );
}