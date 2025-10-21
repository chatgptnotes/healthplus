import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import { combineReducers, createStore, applyMiddleware } from 'redux';
import AppointmentReducer from '../store/reducers/appointmentReducer';
import AuthReducer from '../store/reducers/AuthReducer';
import PatientReducer from '../store/reducers/PatientReducer';
import ReduxThunk from 'redux-thunk';

const rootReducer = combineReducers({
  appointment: AppointmentReducer,
  auth: AuthReducer,
  patient: PatientReducer,
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

export default function RootLayout() {
  return (
    <Provider store={store}>
      <Stack>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </Provider>
  );
}