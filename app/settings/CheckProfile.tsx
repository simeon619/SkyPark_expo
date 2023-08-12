import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';

import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Text, TouchableOpacity, useColorScheme, useWindowDimensions } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { pickImage } from '../../Utilis/functions/media/media';
import { horizontalScale, moderateScale, shadow, verticalScale } from '../../Utilis/metrics';
import { TextExtraLight, TextLight, TextRegular } from '../../components/StyledText';
import { ScrollView, View } from '../../components/Themed';
import ImageProfile from '../../components/utilis/simpleComponent/ImageProfile';
import Colors from '../../constants/Colors';
import { LARGE_PIC_USER } from '../../constants/Value';
import { useAuthStore } from '../../managementState/server/auth';
import { usePatchUser } from '../../managementState/server/updateUser';

const CheckProfile = () => {
  const { width, height } = useWindowDimensions();
  const colorScheme = useColorScheme();

  const { profile, account, address } = useAuthStore((state) => state);
  console.log('🚀 ~ file: CheckProfile.tsx:24 ~ CheckProfile ~ profile:', profile?.imgProfile[0]);
  const { setProfile } = usePatchUser();
  // const [image, setImage] = useState<string[]>([]);
  const router = useRouter();
  const icon = {
    email: require('../../assets/images/email.png'),
    building: require('../../assets/images/building.svg'),
    location: require('../../assets/images/location.svg'),
    telephone: require('../../assets/images/telephone.png'),
  } as const;

  const infoProfile = ({ service, value }: { service: keyof typeof icon; value: string }) => {
    return (
      <View
        lightColor="#0000"
        darkColor="#0000"
        style={{
          flexDirection: 'row',
          alignSelf: 'flex-end',
          alignItems: 'center',
          gap: horizontalScale(15),
          marginVertical: verticalScale(15),
        }}
      >
        <Image source={icon[service]} style={{ width: horizontalScale(25), aspectRatio: 1 }} />
        <TextExtraLight numberOfLines={1} style={{ fontSize: moderateScale(16) }}>
          {value}
        </TextExtraLight>
        <Feather name="edit" size={24} color="black" />
      </View>
    );
  };
  const Stiker = ({ key, value }: { key: string; value: string }) => {
    return (
      <View lightColor="#0000" darkColor="#0000" style={{ flex: 1, alignItems: 'center' }}>
        <View
          lightColor="#EDEDED"
          darkColor="#0000"
          style={{
            position: 'absolute',
            bottom: -30,
            borderRadius: 99,
            borderColor: Colors[colorScheme ?? 'light'].background,
            borderWidth: 5,
            height: verticalScale(60),
            width: horizontalScale(60),
            justifyContent: 'center',
          }}
        >
          <Text
            style={{
              fontSize: moderateScale(20),
              fontWeight: '900',
              color: '#000',
              textAlign: 'center',
            }}
          >
            {value}
          </Text>
        </View>
        <View lightColor="#0000" darkColor="#0000" style={{ bottom: -55, flex: 1 }}>
          <TextLight
            style={{
              fontSize: moderateScale(17),
              color: Colors[colorScheme ?? 'light'].primaryColour,
              textShadowColor: 'rgba(0, 0, 0, 0.25)',
              textShadowOffset: { width: 0, height: 6 },
              textShadowRadius: 10,
              // letterSpacing: 2,
            }}
          >
            {key}
          </TextLight>
        </View>
      </View>
    );
  };

  function next(): void {
    router.push('/(tabs)');
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBar backgroundColor="#EDEDED" />
      <View
        lightColor="#EDEDED"
        style={{
          width,
          height: height * 0.35,
          borderBottomLeftRadius: moderateScale(40),
          borderBottomRightRadius: moderateScale(40),
          justifyContent: 'center',
          alignItems: 'center',
          gap: verticalScale(10),
        }}
      >
        <TouchableWithoutFeedback
          onPress={async () => {
            try {
              let images = await pickImage({ numberImages: 1 });

              if (images && images.length !== 0 && profile?._id) {
                setProfile(
                  {
                    _id: profile?._id,
                  },
                  { imgProfile: images }
                );
              }
            } catch (error) {
              console.error(error);
            }
          }}
        >
          <ImageProfile image={profile?.imgProfile[0]?.url} size={LARGE_PIC_USER + 5} />
          {/* <Image
            style={{
              width: moderateScale(LARGE_PIC_USER + 5),
              aspectRatio: 1,
              marginHorizontal: moderateScale(5),
              borderRadius: LARGE_PIC_USER / 2,
              // borderColor: primaryColourLight,
              borderWidth: 2,
            }}
            source={
              !!profile?.imgProfile[0]?.url
                ? { uri: HOST + profile?.imgProfile[0]?.url }
                : require('../../assets/icon/user.png')
            }
            cachePolicy={'none'}
            contentFit="cover"
            transition={250}
          /> */}
        </TouchableWithoutFeedback>
        <TextLight
          style={{
            fontSize: moderateScale(20),
            color: Colors[colorScheme ?? 'light'].greyDark,
          }}
        >
          Bienvenue {account?.name}
        </TextLight>
        <TextLight
          style={{
            fontSize: moderateScale(17),
            backgroundColor: Colors[colorScheme ?? 'light'].primaryColourLight,
            ...shadow(10),
            color: Colors[colorScheme ?? 'light'].primaryColour,
            paddingVertical: verticalScale(2),
            paddingHorizontal: horizontalScale(9),
            borderRadius: 40,
          }}
        >
          {account?.status}
        </TextLight>
        <View
          lightColor="#0000"
          darkColor="#0000"
          style={{
            position: 'absolute',
            zIndex: 80,
            bottom: 0,
            flexDirection: 'row',
            justifyContent: 'center',
          }}
        >
          {Stiker({ key: 'porte', value: String(address?.etage ?? '00') })}
          {Stiker({ key: 'building', value: String(address?.etage ?? '00') })}
          {Stiker({ key: 'padiezd', value: String(address?.room ?? '00') })}
        </View>
      </View>
      <ScrollView
        lightColor="#EDEDED"
        darkColor="#EDEDED"
        style={{
          height: height * 0.35,
          zIndex: -1,
          borderTopLeftRadius: moderateScale(40),
          borderTopRightRadius: moderateScale(40),
          marginTop: verticalScale(5),
          paddingTop: verticalScale(70),
          paddingHorizontal: horizontalScale(20),
          columnGap: verticalScale(10),
        }}
      >
        {infoProfile({ service: 'email', value: account?.email ?? '' })}
        {infoProfile({ service: 'telephone', value: account?.telephone ?? '' })}
        {infoProfile({ service: 'location', value: address?.city ?? '' })}
        {infoProfile({ service: 'building', value: address?.description ?? '' })}
      </ScrollView>
      <View
        lightColor="#0000"
        darkColor="#0000"
        style={{
          position: 'absolute',
          bottom: verticalScale(-90),
          justifyContent: 'flex-end',
        }}
      >
        <TouchableOpacity
          onPress={() => next()}
          style={{
            // alignSelf: 'center',
            backgroundColor: Colors[colorScheme ?? 'light'].primaryColour,
            paddingVertical: verticalScale(5),
            paddingHorizontal: horizontalScale(30),
            borderRadius: 20,
            marginTop: verticalScale(45),
            alignSelf: 'flex-end',
            zIndex: 99,
            position: 'absolute',
            top: verticalScale(45),
            right: horizontalScale(35),
            // ...style,
          }}
        >
          <TextRegular
            style={{
              fontSize: moderateScale(15),
              color: Colors[colorScheme ?? 'light'].overLay,
              textTransform: 'capitalize',
            }}
          >
            Continuer
          </TextRegular>
        </TouchableOpacity>
        <Image
          source={require('../../assets/images/Vector2.svg')}
          style={{ width: 375, height: 272 }}
          contentFit="contain"
        />
      </View>
    </SafeAreaView>
  );
};

export default CheckProfile;
