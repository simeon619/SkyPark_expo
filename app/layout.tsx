import {
  Poppins_900Black as Black,
  Poppins_900Black_Italic as BlackItalic,
  Poppins_700Bold as Bold,
  Poppins_700Bold_Italic as BoldItalic,
  Poppins_800ExtraBold as ExtraBold,
  Poppins_800ExtraBold_Italic as ExtraBoldItalic,
  Poppins_200ExtraLight as ExtraLight,
  Poppins_200ExtraLight_Italic as ExtraLightItalic,
  Poppins_300Light as Light,
  Poppins_300Light_Italic as LightItalic,
  Poppins_500Medium as Medium,
  Poppins_500Medium_Italic as MediumItalic,
  Poppins_400Regular as Regular,
  Poppins_400Regular_Italic as RegularItalic,
  Poppins_600SemiBold as SemiBold,
  Poppins_600SemiBold_Italic as SemiBoldItalic,
  Poppins_100Thin as Thin,
  Poppins_100Thin_Italic as ThinItalic,
} from '@expo-google-fonts/poppins';
import { DarkTheme, DefaultTheme, NavigationContainer, ThemeProvider } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Font from 'expo-font';
import * as Linking from 'expo-linking';
import { useCallback, useEffect, useState } from 'react';
import { View, useColorScheme } from 'react-native';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { MagicModalPortal } from 'react-native-magic-modal';
import { MenuProvider } from 'react-native-popup-menu';
import '../Utilis/hook/onlineRefresh';
import { useAuthStore } from '../managementState/server/auth';

import { SplashScreen } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { openDatabase } from '../Utilis/functions/initDB';
import { TextLight } from '../components/StyledText';
import Forum from './forum';
import GroupActivity from './groupActivity';
import ItemGroup from './groupActivity/ItemGroup';
import ViewerImage from './pageModal/ViewerImage';
import DetailPost from './pageModal/detailPost';
import discussion from './pageModal/discussion';
import Profile from './profile';
import Login from './register/Login';
import Signup from './register/Signup';
import CheckProfile from './settings/CheckProfile';
import TabLayout from './tabs/layout';

const Stack = createStackNavigator();
const prefix = Linking.createURL('/');
export default function RootLayout() {
  // SplashScreen.preventAutoHideAsync();
  const [appIsReady, setAppIsReady] = useState(false);
  const {  account, fetchLogin } = useAuthStore((state) => state);

  useEffect(() => {
  
  }, []);
  useEffect(() => {
    async function prepare() {
      try {
        // load fonts, make any API calls you need to do here

        if (account) {
         await fetchLogin({ email: account.email, password: account.password });
        }

        const db = await openDatabase('dbName');
        db.exec([{ sql: 'PRAGMA foreign_keys = ON;', args: [] }], false, () => console.log('Foreign keys turned on'));


        await Font.loadAsync({
          SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
          ...{
            Thin,
            ThinItalic,
            ExtraLight,
            ExtraLightItalic,
            Light,
            LightItalic,
            Regular,
            RegularItalic,
            Medium,
            MediumItalic,
            SemiBold,
            SemiBoldItalic,
            Bold,
            BoldItalic,
            ExtraBold,
            ExtraBoldItalic,
            Black,
            BlackItalic,
          },
        });
        // Artificially delay for two seconds to simulate a slow loading
        // experience. Please remove this if you copy and paste the code!
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      setTimeout(() => SplashScreen.hideAsync(), 2000);
      SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }
  return (
    <View onLayout={onLayoutRootView} style={{ flex: 1 }}>
      {appIsReady && <RootLayoutNav />}
    </View>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { isAuth  } = useAuthStore((state) => state);


  return (
    <SafeAreaProvider>
      <NavigationContainer fallback={<TextLight>Loading...</TextLight>}>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <KeyboardProvider>
            <MenuProvider>
              <MagicModalPortal />
              <Stack.Navigator
                screenOptions={{
                  headerShown: false,
                  transitionSpec: {
                    open: {
                      animation: 'spring',
                      config: {},
                    },
                    close: {
                      animation: 'spring',
                      config: {},
                    },
                  },
                }}
                initialRouteName="Bottomtabs"
              >
                {isAuth ? (
                  <>
                    <Stack.Screen name="Bottomtabs" component={TabLayout} />
                    <Stack.Screen
                      name="ViewerImage"
                      component={ViewerImage}
                      options={{
                        headerShown: false,
                        presentation: 'modal',
                        animationEnabled: true,
                        detachPreviousScreen: true,
                      }}
                    />
                    <Stack.Screen name="Profile" component={Profile} />
                    {/* <Stack.Screen name="postDetails" component={PostD} /> */}
                    <Stack.Screen name="Discussion" component={discussion} />
                    <Stack.Screen name="CheckProfile" component={CheckProfile} />
                    <Stack.Screen name="GroupActivity" component={GroupActivity} />
                    <Stack.Screen name="ItemGroup" component={ItemGroup} />
                    <Stack.Screen name="Forum" component={Forum} />
                    <Stack.Screen name="DetailPost" component={DetailPost} />
                  </>
                ) : (
                  <>
                    <Stack.Screen name="Login" component={Login} />
                    <Stack.Screen name="CheckProfile" component={CheckProfile} />
                    <Stack.Screen
                      name="Signup"
                      component={Signup}
                      options={{
                        presentation: 'card',
                        animationEnabled: true,
                      }}
                    />
                  </>
                )}
              </Stack.Navigator>
            </MenuProvider>
          </KeyboardProvider>
        </ThemeProvider>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
