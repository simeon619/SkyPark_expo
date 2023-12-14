import { SafeAreaView } from 'react-native-safe-area-context';

import React from 'react';

import { StyleSheet, useColorScheme, useWindowDimensions } from 'react-native';
import * as Animatable from 'react-native-animatable';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { moderateScale, verticalScale } from '../../Utilis/metrics';
import { TextSemiBold } from '../../components/StyledText';
import Colors from '../../constants/Colors';
import { BottomSheetComponent } from '../../components/register/BottomSheet';

const Login = () => {
  const colorScheme = useColorScheme();

  const { height, width } = useWindowDimensions();

  const slide = {
    0: {
      transform: [{ translateY: 0 }],
    },
    0.5: {
      transform: [{ translateY: 10 }],
    },
    1: {
      transform: [{ translateY: 15 }],
    },
  };

  const BtranslateY = useSharedValue(0);
  const Bopacity = useSharedValue(1);
  const TtranslateY = useSharedValue(0);
  const Topacity = useSharedValue(0);
  const flex = useSharedValue(0);

  const animatedInfoB = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: BtranslateY.value }],
      opacity: Bopacity.value,
    };
  });

  const hideHalf = useAnimatedStyle(() => {
    return {
      flex: flex.value,
      backgroundColor: '#C5A8E6',
    };
  });

  const animatedInfoT = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: TtranslateY.value }],
      opacity: Topacity.value,
    };
  });

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient
        colors={['#FFA7A9', '#fff', '#C5A8E6']}
        locations={[0, 0.5, 0.7]}
        style={{
          flex: 1,
          justifyContent: 'flex-end',
        }}
      >
        <Animated.View
          style={{
            alignItems: 'center',
            width,
            ...animatedInfoT,
          }}
        >
          <Image
            source={require('../../assets/images/register.png')}
            style={{
              width,
              height: verticalScale(height * 0.4),
              aspectRatio: 1,
              alignSelf: 'center',
            }}
          />

          <TextSemiBold
            style={[
              {
                fontSize: moderateScale(23),
                color: Colors[colorScheme ?? 'light'].overLay,
                position: 'absolute',
                bottom: verticalScale(-height * 0.05),
                alignSelf: 'center',
                textAlign: 'left',
              },
            ]}
          >
            <TextSemiBold>Bonjour! </TextSemiBold>
            Inscrivez-vous ou connectez-vous à votre compte
          </TextSemiBold>
        </Animated.View>
        <Animated.View
          style={{
            alignItems: 'center',
            // flex: 1,
            ...animatedInfoB,
          }}
        >
          <Image
            source={require('../../assets/images/register.png')}
            style={{
              width,
              height: verticalScale(height * 0.4),
              aspectRatio: 1,
              alignSelf: 'center',
            }}
          />

          <TextSemiBold
            style={[
              {
                fontSize: moderateScale(23),
                color: Colors[colorScheme ?? 'light'].overLay,
                marginBottom: verticalScale(40),
                alignSelf: 'center',
                textAlign: 'left',
                // fontFamily: "semiBold",
              },
            ]}
          >
            <TextSemiBold>Glissez vers le haut,</TextSemiBold> pour faire connaissance avec vos voisins !
          </TextSemiBold>
        </Animated.View>
        <Animated.View style={{ flex: 1, ...animatedInfoB }}>
          <Animatable.Image
            animation={slide}
            iterationCount={'infinite'}
            style={{ bottom: height * 0.09, alignSelf: 'center' }}
            direction="alternate"
            source={require('../../assets/images/Arrowup.png')}
          />
        </Animated.View>
      </LinearGradient>
      <Animated.View style={{ ...hideHalf }} />
      <BottomSheetComponent
        flex={flex}
        Bopacity={Bopacity}
        Topacity={Topacity}
        BtranslateY={BtranslateY}
        TtranslateY={TtranslateY}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
  input: {},

  buttonText: {
    fontSize: 18,
    fontFamily: 'Gill Sans',
    textAlign: 'center',
    margin: 10,
    color: '#ffffff',
    backgroundColor: 'transparent',
  },
});

export default Login;
