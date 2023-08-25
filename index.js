// import './app/layout';
import { registerRootComponent } from 'expo';

import Start from './app/layout';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

registerRootComponent(Start);
