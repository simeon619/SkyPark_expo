import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View } from '../../components/Themed';
import Colors from '../../constants/Colors';

import { useNavigation } from '@react-navigation/native';
import { Image } from 'expo-image';
import { TextInput, TouchableOpacity, useColorScheme, useWindowDimensions } from 'react-native';
import { horizontalScale, moderateScale, verticalScale } from '../../Utilis/metrics';
import useToggleStore from '../../managementState/client/preference';
import { useAuthStore } from '../../managementState/server/auth';

const Search = () => {
  const { width } = useWindowDimensions();
  const colorScheme = useColorScheme();
  const { primaryColour } = useToggleStore((state) => state);

  const { profile } = useAuthStore((state) => state);
  const navigation = useNavigation();
  return (
    <SafeAreaView style={{ flex: 1 }}>
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
        <TouchableOpacity
          onPress={() => {
            //@ts-ignore
            navigation.navigate('Profile');
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
        </TouchableOpacity>

        <TextInput
          placeholder="Search..."
          placeholderTextColor={Colors[colorScheme ?? 'light'].overLay}
          autoFocus
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            height: moderateScale(28),
            borderBottomWidth: 1,
            gap: horizontalScale(10),
            marginHorizontal: horizontalScale(15),
            borderBottomColor: Colors[colorScheme ?? 'light'].overLay,
            backgroundColor: primaryColour,
            paddingHorizontal: horizontalScale(10),
            fontSize: moderateScale(17),
            color: 'white',
            paddingVertical: verticalScale(5),
          }}
        />
        {/* <Image
            source={require('../../assets/icon/search.png')}
            style={{
              width: moderateScale(22),
              aspectRatio: 1,
              tintColor: Colors[colorScheme ?? 'light'].overLay,
            }}
            transition={200}
          /> */}

        {/* </TextInput> */}
        {/* <TouchableOpacity
          onPress={() => {
            //@ts-ignore
            navigation.navigate('ProfileSettings');
          }}
        >
          <ImageProfile image={profile?.imgProfile[0]?.url} size={SMALL_PIC_USER + 2} />
        </TouchableOpacity> */}
      </View>
    </SafeAreaView>
  );
};

export default Search;
