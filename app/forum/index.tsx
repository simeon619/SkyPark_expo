import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { AnimatePresence, MotiText, MotiView, useAnimationState } from 'moti';
import React, { useState } from 'react';
import { Dimensions, useColorScheme, useWindowDimensions } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { horizontalScale, moderateScale, verticalScale } from '../../Utilis/metrics';
import MotiHat from '../../assets/svg/hat';
import { View } from '../../components/Themed';
import HeaderHome from '../../components/utilis/HeaderHome';
import TabPageItem from '../../components/utilis/TabPageItem';
import Colors from '../../constants/Colors';
import useToggleStore from '../../managementState/client/preference';
import Recent from './PageThree.tsx/Recent';
import MyTheme from './pageOne.tsx/myTheme';
import Response from './pageOne.tsx/response';
import Stars from './pageOne.tsx/stars';
import All from './pageTwo.tsx/all';
import WaitResponse from './pageTwo.tsx/waitResponse';
import { NavigationStackProps } from '../../types/navigation';
//@ts-ignore
const SIZE_TEXT = 16;
const Tabs_Forum = {
  one: 'Forum',
  two: 'Nouveau',
  three: 'Populaire',
};
const Forum = ({ navigation, route }: NavigationStackProps) => {
  const { primaryColour, primaryColourLight } = useToggleStore((state) => state);
  const colorScheme = useColorScheme();
  const { width } = useWindowDimensions();
  const [tab, setTab] = useState(Tabs_Forum.one);
  const animationState = useAnimationState({
    one: {
      transform: [
        {
          translateX: 0,
        },
      ],
    },
    two: {
      transform: [
        {
          translateX: width / 3,
        },
      ],
    },
    three: {
      transform: [
        {
          translateX: width - width / 3 - 25,
        },
      ],
    },
  });
  const TopBarItem = [
    {
      name: Tabs_Forum.one,
      anim: 'one',
    },
    {
      name: Tabs_Forum.two,
      anim: 'two',
    },
    {
      name: Tabs_Forum.three,
      anim: 'three',
    },
  ] as const;
  const Tab = createMaterialTopTabNavigator();
  const Component = {
    [Tabs_Forum.one]: [
      {
        name: 'Mon theme',
        component: MyTheme,
      },
      {
        name: 'reponse',
        component: Response,
      },
      {
        name: 'Favoris',
        component: Stars,
      },
    ],
    [Tabs_Forum.two]: [
      {
        name: 'Tout',
        component: All,
      },
      {
        name: 'Attendre une reponse',
        component: WaitResponse,
      },
    ],
    [Tabs_Forum.three]: [
      {
        name: 'Recents',
        component: Recent,
      },
      {
        name: 'Anciens',
        component: Stars,
      },
    ],
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <HeaderHome navigation={navigation} route={route} />
      <View style={{ flex: 1, paddingHorizontal: horizontalScale(5) }}>
        <View>
          <View
            style={{
              backgroundColor: primaryColourLight,
              flexDirection: 'row',
              paddingVertical: verticalScale(15),
              width: '100%',
              borderTopLeftRadius: moderateScale(10),
              borderTopRightRadius: moderateScale(10),
            }}
          >
            {TopBarItem.map((item, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  style={{ width: width / 3 }}
                  onPress={() => {
                    animationState.transitionTo(item.anim);
                    setTab(item.name);
                  }}
                >
                  {item.name === tab ? null : (
                    <AnimatePresence>
                      <MotiText
                        from={{ translateY: 10, opacity: 0 }}
                        animate={{ translateY: 0, opacity: 1 }}
                        exit={{ translateY: 10, opacity: 0 }}
                        exitTransition={{ type: 'timing', duration: 500 }}
                        style={{
                          fontSize: moderateScale(SIZE_TEXT),
                          color: Colors[colorScheme ?? 'light'].background,
                          textAlign: 'center',
                        }}
                      >
                        {item.name === tab ? '' : item.name}
                      </MotiText>
                    </AnimatePresence>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
          <MotiView
            stylePriority="state"
            transition={{ type: 'timing', duration: 500 }}
            state={animationState}
            style={{ position: 'absolute', bottom: -30 }}
          >
            <MotiHat />
            <AnimatePresence>
              {Object.values(Tabs_Forum).map((item, index) => {
                return (
                  <AnimatePresence key={index}>
                    {item === tab && (
                      <MotiText
                        from={{ translateY: -10, opacity: 0 }}
                        animate={{ translateY: 0, opacity: 1 }}
                        exit={{ translateY: -10, opacity: 0 }}
                        exitTransition={{ type: 'timing', duration: 500 }}
                        style={{
                          fontSize: moderateScale(SIZE_TEXT),
                          color: '#6C0101BA',
                          position: 'absolute',
                          bottom: 5,
                          left: '33%',
                        }}
                      >
                        {tab.substring(0, 5)}
                      </MotiText>
                    )}
                  </AnimatePresence>
                );
              })}
            </AnimatePresence>
          </MotiView>
        </View>
        <View style={{ marginTop: verticalScale(50), flex: 1 }}>
          <Tab.Navigator
            initialRouteName="Buildind"
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
                fontSize: 80,
                height: moderateScale(7),
                fontFamily: 'Thin',
                textTransform: 'capitalize',
              },
            }}
          >
            {Component[tab].map((item, index) => {
              return (
                <Tab.Screen
                  key={index}
                  name={item.name}
                  component={item.component}
                  options={{
                    tabBarLabel({ focused, children }) {
                      return <TabPageItem children={children} focused={focused} />;
                    },
                  }}
                />
              );
            })}
          </Tab.Navigator>
        </View>
      </View>
    </SafeAreaView>
  );
};
export default Forum;
