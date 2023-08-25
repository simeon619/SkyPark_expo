import { Image } from 'expo-image';

import React from 'react';
import { useColorScheme, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { horizontalScale, moderateScale, shadow, verticalScale } from '../../Utilis/metrics';
import { TextLight, TextMedium } from '../../components/StyledText';
import { View } from '../../components/Themed';
import HeaderHome from '../../components/utilis/HeaderHome';
import Colors from '../../constants/Colors';
import { LARGE_PIC_USER } from '../../constants/Value';
import useToggleStore from '../../managementState/client/preference';

const ItemGroup = ({ route, navigation }: { route: any; navigation: any }) => {
  const item = route.params as any as { pic: string; banner: string; name: string; id: string };

  const colorScheme = useColorScheme();
  const { height } = useWindowDimensions();
  const { primaryColour } = useToggleStore((state) => state);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors[colorScheme ?? 'light'].background }}>
      <HeaderHome navigation={navigation} route={route} />
      <View style={{ height: 'auto' }}>
        <Image source={{ uri: item.banner }} style={{ width: '100%', height: height * 0.35 }} />
        <View
          style={{
            position: 'absolute',
            bottom: -verticalScale(75),
            borderRadius: moderateScale(20),
            ...shadow(5),
            width: '90%',
            alignSelf: 'center',
            // height: '100%',
            backgroundColor: Colors[colorScheme ?? 'light'].grey,
            // backgroundColor: 'red',
          }}
        >
          <Image
            source={{ uri: item.pic }}
            style={{
              width: moderateScale(LARGE_PIC_USER),
              aspectRatio: 1,
              position: 'absolute',
              alignSelf: 'center',
              top: -LARGE_PIC_USER / 2,
              borderRadius: 999,
            }}
          />
          <TextMedium
            style={{
              fontSize: moderateScale(18),
              textAlign: 'center',
              paddingTop: verticalScale(LARGE_PIC_USER) * 0.6,
              marginBottom: verticalScale(15),
            }}
          >
            {item.name}
          </TextMedium>

          <TextLight
            style={{
              textAlign: 'center',
              backgroundColor: Colors[colorScheme ?? 'light'].grey,
              borderTopColor: '#0002',
              borderTopWidth: 1,
              paddingVertical: horizontalScale(10),
              fontSize: moderateScale(15),
              color: primaryColour,
            }}
          >
            Quitter le groupe
          </TextLight>
        </View>
      </View>
      <View style={{ marginTop: LARGE_PIC_USER }}>{/* <SearchGroup /> */}</View>
    </SafeAreaView>
  );
};

export default ItemGroup;
