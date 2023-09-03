// import './app/layout';
import { registerRootComponent } from 'expo';

import * as SplashScreen from 'expo-splash-screen';
import Start from './app/layout';

SplashScreen.preventAutoHideAsync();

registerRootComponent(Start);
