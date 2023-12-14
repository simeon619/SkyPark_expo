import { Ionicons } from '@expo/vector-icons';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Image } from 'expo-image';
import React from 'react';
import { Dimensions, useColorScheme } from 'react-native';
import { Menu, MenuOption, MenuOptions, MenuTrigger } from 'react-native-popup-menu';
import { SafeAreaView } from 'react-native-safe-area-context';
import { horizontalScale, moderateScale, shadow, verticalScale } from '../../Utilis/metrics';
import { TextMedium } from '../../components/StyledText';
import { View } from '../../components/Themed';
import ItemMenu from '../../components/discussion/ItemMenu';
import TabPageItem from '../../components/utilis/TabPageItem';
import Colors from '../../constants/Colors';
import useToggleStore, { useMenuDiscussionIsOpen } from '../../managementState/client/preference';
import Call from '../pageDiscussions/Call';
import Chat from '../pageDiscussions/Chat';
import CieGestion from '../pageDiscussions/CieGestion';
const DiscusionTabScreen = () => {
  const { primaryColour } = useToggleStore((state) => state);
  const { toggleValue } = useMenuDiscussionIsOpen((state) => state);
  const colorScheme = useColorScheme();
  const Tab = createMaterialTopTabNavigator();
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingVertical: verticalScale(10),
          paddingHorizontal: horizontalScale(10),
        }}
      >
        <View>
          <TextMedium style={{ fontSize: moderateScale(21) }}>Discussions</TextMedium>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            columnGap: horizontalScale(16),
          }}
        >
          <Image
            source={require('../../assets/icon/search.png')}
            style={{ width: moderateScale(22), aspectRatio: 1, tintColor: Colors[colorScheme ?? 'light'].greyDark }}
          />
          <Menu onClose={toggleValue} onOpen={toggleValue}>
            <MenuTrigger
              children={
                <Ionicons name="reorder-four-outline" size={25} color={Colors[colorScheme ?? 'light'].greyDark} />
              }
            />
            <MenuOptions
              optionsContainerStyle={{
                borderRadius: moderateScale(20),
                width: 'auto',
                paddingHorizontal: horizontalScale(15),
                ...shadow(92),
              }}
            >
              <MenuOption onSelect={() => alert(`Delete`)}>
                <ItemMenu value="Creez Groupe" />
              </MenuOption>
              <MenuOption onSelect={() => alert(`Delete`)}>
                <ItemMenu value="Epinglez" />
              </MenuOption>
              <MenuOption onSelect={() => alert(`Delete`)}>
                <ItemMenu value="Bloquez" />
              </MenuOption>
              <MenuOption onSelect={() => alert(`Delete`)}>
                <ItemMenu value="Settings" />
              </MenuOption>
              <MenuOption onSelect={() => alert(`Delete`)}>
                <ItemMenu value="Archives" />
              </MenuOption>
            </MenuOptions>
          </Menu>
        </View>
      </View>
      <View style={{ flex: 1 }}>
        <Tab.Navigator
          initialRouteName="Chat"
          backBehavior="order"
          initialLayout={{
            width: Dimensions.get('window').width,
          }}
          screenOptions={{
            tabBarScrollEnabled: true,
            tabBarStyle: {
              backgroundColor: '#fff',
            },
            tabBarIndicatorStyle: {
              backgroundColor: primaryColour,
            },

            tabBarItemStyle: {
              width: 'auto',
            },
          }}
        >
          <Tab.Screen
            name="Chat"
            component={Chat}
            options={{
              tabBarLabel({ focused, children }) {
                return <TabPageItem children={children} focused={focused} />;
              },
            }}
          />
          {/* <Tab.Screen
            name="Compagnie de Gestion"
            component={CieGestion}
            options={{
              tabBarLabel({ focused, children }) {
                return <TabPageItem children={children} focused={focused} />;
              },
            }}
          /> */}
          <Tab.Screen
            name="Appels"
            component={Call}
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

export default DiscusionTabScreen;
