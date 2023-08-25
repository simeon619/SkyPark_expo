import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { Dimensions, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { horizontalScale, moderateScale } from '../../Utilis/metrics';
import { View } from '../../components/Themed';
import HeaderHome from '../../components/utilis/HeaderHome';
import TabPageItem from '../../components/utilis/TabPageItem';
import Colors from '../../constants/Colors';
import useToggleStore from '../../managementState/client/preference';
import CieGestion from '../pagePost/CieGestion';
import Neighbor from '../pagePost/Neighbor';
import { useListUserStore } from '../../managementState/server/Listuser';
import { NavigationStackProps } from '../../types/navigation';

const Home = ({ navigation, route }: NavigationStackProps) => {
  const { primaryColour } = useToggleStore((state) => state);

  const colorScheme = useColorScheme();
  const Tab = createMaterialTopTabNavigator();

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors[colorScheme ?? 'light'].background,
      }}
    >
      <StatusBar backgroundColor={primaryColour} style={'light'} />
      <HeaderHome navigation={navigation} route={route} />
      <View style={{ flex: 1, paddingHorizontal: horizontalScale(10) }}>
        <Tab.Navigator
          initialRouteName="Tous les voisins"
          backBehavior="order"
          initialLayout={{
            width: Dimensions.get('window').width,
          }}
          screenOptions={{
            // tabBarGap: horizontalScale(25),
            tabBarScrollEnabled: true,
            tabBarStyle: {
              backgroundColor: '#fff',
            },
            tabBarIndicatorStyle: {
              backgroundColor: primaryColour,
            },
            tabBarItemStyle: {
              width: 'auto',
              height: 'auto',
              alignItems: 'flex-start',
            },
            tabBarLabelStyle: {
              fontSize: moderateScale(80),
              height: moderateScale(7),
              fontFamily: 'Thin',
              textTransform: 'capitalize',
            },
          }}
        >
          <Tab.Screen
            name="Tous les voisins"
            component={Neighbor}
            options={{
              tabBarLabel({ focused, children }) {
                return <TabPageItem children={children} focused={focused} />;
              },
            }}
          />

          <Tab.Screen
            name="Compagnie de gestions"
            component={CieGestion}
            options={{
              tabBarLabel({ focused, children }) {
                return <TabPageItem children={children} focused={focused} />;
              },
            }}
          />
        </Tab.Navigator>
      </View>
    </SafeAreaView>
  );
};

export default Home;
