import { Image } from 'expo-image';
import React from 'react';
import { TouchableOpacity, useColorScheme, useWindowDimensions, View } from 'react-native';
import Colors from '../../constants/Colors';
import { HOST, SMALL_PIC_USER } from '../../constants/Value';
import useToggleStore, { useTypeForm } from '../../managementState/client/preference';
import { useAuthStore } from '../../managementState/server/auth';
import { icons } from '../../Utilis/data';
import { horizontalScale, moderateScale, verticalScale } from '../../Utilis/metrics';
import { TextThin } from '../StyledText';
import { ScrollView } from '../Themed';
import ImageProfile from './simpleComponent/ImageProfile';
import { NavigationStackProps } from '../../types/navigation';
import Animated from 'react-native-reanimated';

const HeaderHome = ({ navigation, route }: NavigationStackProps) => {
  const { width } = useWindowDimensions();
  const colorScheme = useColorScheme();
  const { primaryColour, primaryColourLight } = useToggleStore((state) => state);
  const { IconName, switchForm } = useTypeForm((state) => state);

  const { profile } = useAuthStore((state) => state);

  return (
    <>
      <View
        style={{
          width,
          backgroundColor: primaryColour,
          // backgroundColor: "blue",
          paddingHorizontal: horizontalScale(10),
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: verticalScale(5),
        }}
      >
        <Image
          source={require('../../assets/icon/menu.png')}
          style={{
            height: moderateScale(28),
            aspectRatio: 1,
            marginTop: 3,
            tintColor: Colors[colorScheme ?? 'light'].overLay,
            transform: [{ rotate: '180deg' }],
            // backgroundColor: "red",
          }}
        />
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            height: moderateScale(28),
            borderBottomWidth: 1,
            gap: horizontalScale(10),
            paddingBottom: verticalScale(5),
            marginHorizontal: horizontalScale(15),
            borderBottomColor: Colors[colorScheme ?? 'light'].overLay,
            backgroundColor: primaryColour,
          }}
        >
          <Image
            source={require('../../assets/icon/search.png')}
            style={{
              width: moderateScale(22),
              aspectRatio: 1,
              tintColor: Colors[colorScheme ?? 'light'].overLay,

              // backgroundColor: "red",
            }}
            transition={200}
          />
          <TextThin
            style={{
              color: Colors[colorScheme ?? 'light'].overLay,
              fontSize: moderateScale(16),
            }}
          >
            Search
          </TextThin>
        </View>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Profile');
          }}
        >
          <ImageProfile image={profile?.imgProfile[0]?.url} size={SMALL_PIC_USER + 2} />
        </TouchableOpacity>
      </View>
      <View
        style={{
          paddingBottom: horizontalScale(0),
          backgroundColor: Colors[colorScheme ?? 'light'].background,
        }}
      >
        <ScrollView
          // horizontal={true}
          style={{ paddingVertical: verticalScale(15) }}
          contentContainerStyle={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
          }}
        >
          {icons.map((icon, index) => (
            <TouchableOpacity key={index} onPress={() => switchForm(icon.name)}>
              {
                <Image
                  source={icon.url}
                  style={{
                    width: 27,
                    aspectRatio: 1,
                    tintColor: IconName === icon.name ? primaryColour : '#000000',
                  }}
                  transition={200}
                />
              }
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </>
  );
};
export default HeaderHome;
