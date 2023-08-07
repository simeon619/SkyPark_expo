import { Entypo } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { BottomFabBar } from 'sim-bottom-tab';
import { shadow, verticalScale } from '../../Utilis/metrics';
import useToggleStore from '../../managementState/client/preference';

export default function TabLayout() {
  const { primaryColourLight } = useToggleStore((state) => state);
  return (
    <Tabs
    
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
      <Tabs.Screen
        name="index"
        options={{
          title: 'Tab One',
          tabBarIcon: () => <Entypo name="home" size={20} />,
        }}
      />
      <Tabs.Screen
        name="discussions"
        options={{
          title: 'discussions',
          tabBarIcon: () => <Entypo name="message" size={20} />,
        }}
      />
      <Tabs.Screen
        name="post"
        options={{
          headerShown: false,
          headerTransparent: true,
          tabBarIcon: () => <Entypo name="plus" size={20} />,
        }}
      />
      <Tabs.Screen
        name="user"
        options={{
          title: 'Tab Two',
          tabBarIcon: () => <FontAwesome name="user" size={20} />,
        }}
      />
      <Tabs.Screen
        name="notification"
        options={{
          title: 'Tab Two',
          tabBarIcon: () => <FontAwesome name="bell" size={20} />,
        }}
      />
    </Tabs>
  );
}
