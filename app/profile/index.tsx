import { Image } from 'expo-image';

import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useState } from 'react';
import { ImageBackground, Pressable, TouchableOpacity, useColorScheme, useWindowDimensions } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { icons } from '../../Utilis/data';
import { removeValue } from '../../Utilis/functions/localStorage';
import { horizontalScale, moderateScale, shadow, verticalScale } from '../../Utilis/metrics';
import { TextLight, TextMedium, TextRegular, TextSemiBold, TextThinItalic } from '../../components/StyledText';
import { ScrollView, View } from '../../components/Themed';
import MediaComponent from '../../components/utilis/MediaComponent';
import ImageProfile from '../../components/utilis/simpleComponent/ImageProfile';
import Colors from '../../constants/Colors';
import { LARGE_PIC_USER } from '../../constants/Value';
import useToggleStore from '../../managementState/client/preference';
import { useAuthStore } from '../../managementState/server/auth';
import { NavigationStackProps } from '../../types/navigation';

const Profile = ({ navigation, route }: NavigationStackProps) => {
  const { profile, address, account, fetchDisconnect } = useAuthStore((state) => state);
  const { primaryColour, name, toggleState } = useToggleStore((state) => state);

  const { width } = useWindowDimensions();
  const colorScheme = useColorScheme();

  const iconActivity = [
    { url: require('../../assets/icon/reunion.png'), name: 'Groups' },
    { url: require('../../assets/icon/exercer.png'), name: 'Forum' },
    { url: require('../../assets/icon/monde.png'), name: 'map' },
  ];

  const iconSettings = [
    { url: require('../../assets/icon/reunion.png'), name: 'Services' },
    { url: require('../../assets/icon/exercer.png'), name: 'Parametre' },
  ];
  const mediaProfile = {
    all: {
      selected: true,
      medias: [
        'https://picsum.photos/1850/1300',
        'https://picsum.photos/1800/1400',
        'https://picsum.photos/1500/1200',
        'https://picsum.photos/800/1300',
      ],
    },
    videos: {
      selected: false,
      medias: [
        'https://picsum.photos/1850/1300',
        'https://picsum.photos/1900/1800',
        'https://picsum.photos/1700/1200',
        'https://picsum.photos/800/1400',
      ],
    },
    images: {
      selected: false,
      medias: [
        'https://picsum.photos/1700/1300',
        'https://picsum.photos/1850/1400',
        'https://picsum.photos/1600/1200',
        'https://picsum.photos/1800/1300',
      ],
    },
  };

  const switchBat = useAnimatedStyle(() => {
    return {
      // transform: [{ scale: toggleValue ? 1 : 0 }],
      //  flexDirection: name === 'Neighbor' ? 'row' : 'row-reverse',
    };
  });

  const [mediaProfileState, setMediaProfileState] = useState(mediaProfile);

  const handleMediaProfilePress = useCallback((key: keyof typeof mediaProfile) => {
    setMediaProfileState((prevState) => {
      const newState = { ...prevState };
      Object.keys(newState).forEach((keyPrev) => {
        let key: keyof typeof mediaProfile = keyPrev as any;
        newState[key].selected = false;
      });
      newState[key].selected = true;
      return newState;
    });
  }, []);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors[colorScheme ?? 'light'].background,
      }}
    >
      <StatusBar backgroundColor={primaryColour} style={'light'} />
      <ScrollView style={{ flex: 1 }}>
        <ImageBackground
          source={require('../../assets/images/profileBanner.jpg')}
          style={{
            height: verticalScale(290),
            position: 'relative',
            // overflow: "hidden",
          }}
        >
          <View
            style={{
              width: moderateScale(150),
              aspectRatio: 1,
              position: 'absolute',
              // transform: [{ rotate: "80deg" }],
              top: -80,
              // left: -50,
              backgroundColor: '#FF6B8633',
              borderRadius: 100,
            }}
          />
          <View
            style={{
              width: moderateScale(150),
              aspectRatio: 1,
              position: 'absolute',
              top: -70,
              left: -60,

              backgroundColor: '#B2E7DA33',
              borderRadius: 100,
            }}
          />
          <View
            style={{
              width: horizontalScale(194),
              ...shadow(10),
              position: 'absolute',
              height: verticalScale(157),
              paddingTop: verticalScale(13),
              bottom: -157 / 3,
              borderRadius: moderateScale(20),
              left: horizontalScale(194) / 2,
              alignItems: 'center',
              zIndex: 5,
            }}
          >
            <ImageProfile size={LARGE_PIC_USER - 5} image={profile?.imgProfile[0]?.url} />
            <TextSemiBold>{account?.name} </TextSemiBold>
            <TextThinItalic>
              padiezd {address?.room} - Etage {address?.etage}
            </TextThinItalic>
          </View>
          <View
            style={{
              width: horizontalScale(166),
              ...shadow(10),
              position: 'absolute',
              height: verticalScale(107),
              bottom: -157 / 2.3,
              borderRadius: moderateScale(20),
              left: horizontalScale(166) / 1.5,
              alignItems: 'center',
              zIndex: 1,
            }}
          ></View>
        </ImageBackground>
        <View style={{ marginTop: horizontalScale(166 / 2), alignItems: 'center' }}>
          <Pressable style={{ backgroundColor: 'transparent' }} onPress={() => toggleState()}>
            <Animated.View
              style={[
                //   switchBat,
                {
                  flexDirection: name === 'Neighbor' ? 'row' : 'row-reverse',
                  backgroundColor: primaryColour,
                  paddingVertical: verticalScale(3),
                  paddingRight: horizontalScale(10),
                  paddingLeft: horizontalScale(2),
                  borderRadius: moderateScale(100),
                  ...shadow(10),
                  alignItems: 'center',
                  columnGap: horizontalScale(10),
                },
              ]}
            >
              <View
                style={{
                  width: horizontalScale(35),
                  aspectRatio: 1,
                  borderRadius: 100,
                  // alignItems: 'center',
                  backgroundColor: Colors[colorScheme ?? 'light'].background,
                }}
              />
              <TextLight style={{ fontSize: moderateScale(17), marginTop: verticalScale(3) }}>{name}</TextLight>
            </Animated.View>
          </Pressable>
        </View>
        <View
          style={{
            flexDirection: 'row',
            // flexWrap: 'wrap',
            justifyContent: 'space-around',
            // gap: moderateScale(20),
            marginTop: verticalScale(10),
            ...shadow(10),
            paddingTop: verticalScale(10),
            marginHorizontal: horizontalScale(35),
            borderRadius: 20,
          }}
        >
          {icons.map((icon, index) => (
            <TouchableOpacity key={index} style={{ width: width / 6, alignItems: 'center' }}>
              {<Image source={icon.url} style={{ width: horizontalScale(25), aspectRatio: 1 }} transition={200} />}
              <TextMedium
                style={{
                  fontSize: moderateScale(12),
                  color: '#aaa',
                  // paddingVertical: verticalScale(10),
                }}
              >
                {icon.name}
              </TextMedium>
            </TouchableOpacity>
          ))}
        </View>

        <View
          lightColor="transparent"
          style={{
            flexDirection: 'row',
            // flexWrap: 'wrap',
            justifyContent: 'center',
            marginTop: verticalScale(10),
            marginVertical: verticalScale(15),
            // rowGap: verticalScale(5),
            columnGap: horizontalScale(10),
          }}
        >
          {iconActivity.map((icon, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                if (index === 0) {
                  navigation.navigate('GroupActivity');
                }

                if (index === 1) {
                  navigation.navigate('Forum');
                }
                if (index === 2) {
                  // navigation.navigate('');
                }
                if (index === 3) {
                  // navigation.navigate('HomeTab');
                }
              }}
              style={[
                {
                  // width: width / 2.3,
                  paddingVertical: verticalScale(10),
                  alignItems: 'center',
                  flexDirection: 'row',
                  columnGap: horizontalScale(4),
                  backgroundColor: '#F6F4F8',
                  ...shadow(5),
                  paddingHorizontal: horizontalScale(10),
                },
                index === 0 && { borderTopLeftRadius: 20, borderBottomLeftRadius: 20 },
                index === 2 && { borderTopRightRadius: 20, borderBottomRightRadius: 20 },
              ]}
            >
              <Image
                source={icon.url}
                style={{
                  width: horizontalScale(30),
                  aspectRatio: 1,
                }}
                transition={200}
              />

              <TextRegular
                style={{
                  fontSize: moderateScale(14),
                  color: '#aaa',
                }}
              >
                {icon.name}
              </TextRegular>
            </TouchableOpacity>
          ))}
        </View>
        <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center', marginBottom: verticalScale(10) }}>
          {Object.keys(mediaProfileState).map((keyMedia, index) => {
            let key = keyMedia as keyof typeof mediaProfileState;
            return (
              <View key={index}>
                <TouchableOpacity
                  onPress={() => handleMediaProfilePress(key)}
                  style={{ paddingHorizontal: horizontalScale(15) }}
                >
                  <TextLight
                    style={[
                      {
                        fontSize: moderateScale(17),
                        textTransform: 'capitalize',
                      },
                      mediaProfileState[key]?.selected
                        ? {
                            borderBottomColor: primaryColour,
                            borderBottomWidth: 2,
                          }
                        : { color: '#aaa' },
                    ]}
                  >
                    {key}
                  </TextLight>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
        <View style={{ flex: 1, paddingHorizontal: horizontalScale(20) }}>
          {Object.keys(mediaProfileState).map((keyMedia, index) => {
            let key = keyMedia as keyof typeof mediaProfileState;
            let media = mediaProfileState[key].medias.map((media) => {
              return {
                url: media,
                size: 1,
                extension: 'jpg',
                _id: index.toString(),
              };
            });
            if (mediaProfileState[key].selected) {
              return <MediaComponent media={media} key={key} caption="" />;
            }
          })}
        </View>
        <View
          lightColor="transparent"
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',

            marginTop: verticalScale(10),

            marginVertical: verticalScale(15),

            rowGap: verticalScale(5),
            columnGap: horizontalScale(10),
          }}
        >
          {iconSettings.map((icon, index) => (
            <TouchableOpacity
              key={index}
              style={[
                {
                  width: width / 2.3,
                  paddingVertical: verticalScale(10),
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'space-evenly',
                  backgroundColor: '#F6F4F8',
                  ...shadow(5),
                },
                index === 0 && { borderTopLeftRadius: 20, borderBottomLeftRadius: 20 },
                index === 1 && { borderTopRightRadius: 20, borderBottomRightRadius: 20 },
              ]}
            >
              <Image
                source={icon.url}
                style={{
                  width: horizontalScale(38),
                  aspectRatio: 1,
                }}
                transition={2000}
              />

              <TextRegular
                style={{
                  fontSize: moderateScale(15),
                  color: '#aaa',
                }}
              >
                {icon.name}
              </TextRegular>
            </TouchableOpacity>
          ))}
        </View>
        <View style={{ paddingHorizontal: horizontalScale(20) }}>
          <TouchableOpacity
            style={{
              backgroundColor: '#E6D6F8',
              paddingHorizontal: horizontalScale(20),
              marginBottom: verticalScale(10),
              paddingVertical: verticalScale(5),
              ...shadow(10),
              borderRadius: moderateScale(10),
            }}
            onPress={() => {
              const disco = async () => {
                await removeValue('profile');
                await fetchDisconnect();
              };

              disco();
            }}
          >
            <TextRegular style={{ fontSize: moderateScale(17), textAlign: 'center', color: '#444' }}>
              Déconnexion
            </TextRegular>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
