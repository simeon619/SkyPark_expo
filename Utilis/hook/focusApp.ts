import { useEffect } from 'react';
import { AppState, AppStateStatus, Platform } from 'react-native';

function onAppStateChange(status: AppStateStatus) {
  if (Platform.OS !== 'web') {
    status;
  }
}

useEffect(() => {
  const subscription = AppState.addEventListener('change', onAppStateChange);

  return () => subscription.remove();
}, []);
