import BottomSheet, {
  BottomSheetBackgroundProps,
  useBottomSheetDynamicSnapPoints,
  useBottomSheetSpringConfigs,
} from '@gorhom/bottom-sheet';

import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { TouchableWithoutFeedback, useColorScheme, useWindowDimensions } from 'react-native';
import Animated, { interpolateColor, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { horizontalScale, moderateScale, verticalScale } from '../../Utilis/metrics';
import Colors from '../../constants/Colors';
import { useAuthStore } from '../../managementState/server/auth';
import { TextExtraLightItalic, TextRegular } from '../StyledText';
import { View } from '../Themed';
import { InputBottomSheet } from './input';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export const BottomSheetComponent = ({
  BtranslateY,
  Bopacity,
  TtranslateY,
  Topacity,
  flex,
}: {
  BtranslateY: any;
  Bopacity: any;
  TtranslateY: any;
  Topacity: any;
  flex: any;
}) => {
  const { address, profile, user, fetchLogin } = useAuthStore();
  const navigation = useNavigation();

  useEffect(() => {
    if (user?._id && address?._id && profile?._id) {
      //@ts-ignore
      navigation.navigate('CheckProfile');
    }
  });

  const bottomSheetRef = useRef<BottomSheet>(null);
  const { control, getValues } = useForm({ mode: 'onChange' });

  const { height, width } = useWindowDimensions();
  const colorScheme = useColorScheme();
  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === 0) {
        if (BtranslateY.value !== 0) {
          BtranslateY.value = withSpring(0);
          flex.value = withSpring(0);
          Bopacity.value = withSpring(1);
        }
      } else if (index === 1) {
        if (BtranslateY.value !== -height * 0.4) {
          BtranslateY.value = withSpring(-height * 0.4);
          flex.value = withSpring(1);
          Bopacity.value = withSpring(0);
        }
      }

      if (index === 1) {
        if (TtranslateY.value !== height * 0.5) {
          TtranslateY.value = withSpring(height * 0.5);
          Topacity.value = withSpring(1);
        }
      } else {
        if (TtranslateY.value !== 0) {
          TtranslateY.value = withSpring(0);
          Topacity.value = withSpring(0);
        }
      }
    },
    [BtranslateY, Bopacity, TtranslateY, Topacity, flex, height]
  );
  const CustomBackground: React.FC<BottomSheetBackgroundProps> = ({ style, animatedIndex }) => {
    const containerAnimatedStyle = useAnimatedStyle(() => ({
      backgroundColor: interpolateColor(animatedIndex.value, [0, 1], ['#fff', '#FCF3F3']),
    }));
    const containerStyle = useMemo(() => [style, containerAnimatedStyle], [style, containerAnimatedStyle]);
    return <Animated.View pointerEvents="none" style={containerStyle} />;
  };
  const snapPoints = useMemo(() => ['6%', '50%'], []);
  const { animatedHandleHeight, animatedSnapPoints, animatedContentHeight, handleContentLayout } =
    useBottomSheetDynamicSnapPoints(snapPoints);
  const animationConfigs = useBottomSheetSpringConfigs({
    damping: 80,
    overshootClamping: true,
    restDisplacementThreshold: 0.1,
    restSpeedThreshold: 0.1,
    stiffness: 500,
  });

  return (
    <BottomSheet
      // snapPoints={snapPoints}
      ref={bottomSheetRef}
      onChange={handleSheetChanges}
      snapPoints={animatedSnapPoints}
      handleHeight={animatedHandleHeight}
      contentHeight={animatedContentHeight}
      animationConfigs={animationConfigs}
      backgroundComponent={CustomBackground}
      style={{ borderRadius: moderateScale(25), overflow: 'hidden' }}
      handleIndicatorStyle={{
        width: width * 0.3,
        marginTop: height * 0.02,
      }}
    >
      <View
        lightColor="#FCF3F3"
        darkColor="#FCF3F3"
        onLayout={handleContentLayout}
        style={{
          paddingTop: height * 0.01,
          paddingHorizontal: width * 0.05,
          borderRadius: moderateScale(25),
          flex: 1,
          // backgroundColor: "#FCF3F3",
        }}
      >
        {/* <CreateInputEmail control={control} /> */}
        <InputBottomSheet
          defaultyValue="u1@gmail.com"
          name="email"
          placeholder="Entrez votre adresse email"
          securePassword={false}
          control={control}
        />
        <InputBottomSheet
          defaultyValue="u1"
          name="password"
          placeholder="Entrez Mot de passe "
          securePassword={true}
          control={control}
        />

        <View style={{ backgroundColor: '#0000' }}>
          <TextExtraLightItalic
            style={{
              textAlign: 'right',
              paddingVertical: verticalScale(10),
              color: Colors[colorScheme ?? 'light'].secondaryColour,
            }}
          >
            Mot de passe Oublie ?
          </TextExtraLightItalic>
        </View>

        <TouchableWithoutFeedback
          style={{
            alignSelf: 'center',
            backgroundColor: Colors[colorScheme ?? 'light'].primaryColour,
            paddingVertical: verticalScale(5),
            paddingHorizontal: horizontalScale(30),
            borderRadius: 20,
            marginTop: verticalScale(25),
          }}
          // disabled={loading}
          onPress={() => {
            fetchLogin({ email: getValues('email'), password: getValues('password') });
          }}
        >
          <TextRegular
            style={{
              fontSize: moderateScale(16),
              color: Colors[colorScheme ?? 'light'].overLay,
            }}
          >
            Connexion
          </TextRegular>
        </TouchableWithoutFeedback>

        <TouchableOpacity
          onPress={() => {
            //@ts-ignore
            navigation.navigate('Signup');
          }}
          style={{ marginTop: verticalScale(35) }}
        >
          <TextRegular
            style={{
              fontSize: moderateScale(14),
              color: Colors[colorScheme ?? 'light'].secondaryColour,
              textAlign: 'center',
            }}
          >
            <TextRegular>Pas de compte ? </TextRegular>
            Creez en un
          </TextRegular>
        </TouchableOpacity>
      </View>
    </BottomSheet>
  );
};
