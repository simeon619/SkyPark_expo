import { Entypo } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import { BottomFabBar } from 'sim-bottom-tab';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { shadow, verticalScale } from '../../Utilis/metrics';
import useToggleStore from '../../managementState/client/preference';
import Home from '.';
import DiscusionTabScreen from './discussions';
import PostTabScreen from './post';
import UserTabScreen from './user';
import NotificationTabScreen from './notification';

export default function TabLayout() {
  const { primaryColourLight } = useToggleStore((state) => state);

  const Tab = createBottomTabNavigator();
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#fff',
        headerShown: false,
        // headerTransparent: true,
        tabBarStyle: { ...shadow(90), height: verticalScale(65) },
        tabBarActiveBackgroundColor: primaryColourLight,
      }}
      tabBar={(props) => (
        <BottomFabBar
          mode={'default'}
          focusedButtonStyle={{ ...shadow(90) }}
          bottomBarContainerStyle={[
            {
              // position: "absolute",
              // bottom: 0,
              // left: 0,
              // right: 0,
            },
          ]}
          {...props}
        />
      )}
    >
      <Tab.Screen
        //@ts-ignore
        name="HomeTab"
        options={{
          title: 'home',
          tabBarIcon: () => <Entypo name="home" size={20} />,
        }}
        component={Home}
      />
      <Tab.Screen
        name="DiscussionsTab"
        options={{
          title: 'discussions',
          tabBarIcon: () => <Entypo name="message" size={20} />,
        }}
        component={DiscusionTabScreen}
      />
      <Tab.Screen
        name="PostTab"
        options={{
          headerShown: false,
          headerTransparent: true,
          tabBarIcon: () => <Entypo name="plus" size={20} />,
        }}
        component={PostTabScreen}
      />
      <Tab.Screen
        name="UserTab"
        options={{
          title: 'user',
          tabBarIcon: () => <FontAwesome name="user" size={20} />,
        }}
        component={UserTabScreen}
      />
      <Tab.Screen
        name="NotificationTab"
        options={{
          title: 'notification',
          tabBarIcon: () => <FontAwesome name="bell" size={20} />,
        }}
        component={NotificationTabScreen}
      />
    </Tab.Navigator>
  );
}
