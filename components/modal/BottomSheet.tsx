import FontAwesome from "@expo/vector-icons/FontAwesome";
import BottomSheet, {
  BottomSheetBackgroundProps,
  BottomSheetTextInput,
  useBottomSheetDynamicSnapPoints,
  useBottomSheetSpringConfigs,
} from "@gorhom/bottom-sheet";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { useColorScheme, useWindowDimensions } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import {
  horizontalScale,
  moderateScale,
  shadow,
  verticalScale,
} from "../../Utilis/metrics";
import Colors from "../../constants/Colors";
import { TextExtraLightItalic, TextRegular } from "../StyledText";
import { View } from "../Themed";
const BottomSheetModal = () => {
  const snapPoints = useMemo(() => ["6%", "50%"], []);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const { width, height } = useWindowDimensions();
  const colorScheme = useColorScheme();
  const [password, setPassword] = useState<string>();
  const [email, setEmail] = useState<string>();

  const CustomBackground: React.FC<BottomSheetBackgroundProps> = ({
    style,
    animatedIndex,
  }) => {
    const containerAnimatedStyle = useAnimatedStyle(() => ({
      backgroundColor: interpolateColor(
        animatedIndex.value,
        [0, 1],
        ["#fff", "#FCF3F3"],
      ),
    }));
    const containerStyle = useMemo(
      () => [style, containerAnimatedStyle],
      [style, containerAnimatedStyle],
    );

    return <Animated.View pointerEvents="none" style={containerStyle} />;
  };
  const BtranslateY = useSharedValue(0);
  const Bopacity = useSharedValue(1);
  const TtranslateY = useSharedValue(0);
  const Topacity = useSharedValue(0);
  const flex = useSharedValue(0);
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
    [BtranslateY, Bopacity, TtranslateY, Topacity, flex, height],
  );

  const animatedInfoB = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: BtranslateY.value }],
      opacity: Bopacity.value,
    };
  });

  const hideHalf = useAnimatedStyle(() => {
    return {
      flex: flex.value,
      backgroundColor: "#C5A8E6",
    };
  });

  const animatedInfoT = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: TtranslateY.value }],
      opacity: Topacity.value,
    };
  });

  const {
    animatedHandleHeight,
    animatedSnapPoints,
    animatedContentHeight,
    handleContentLayout,
  } = useBottomSheetDynamicSnapPoints(snapPoints);
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
      // containerStyle={{ borderRadius: moderateScale(25), overflow: "hidden" }}
      style={{ borderRadius: moderateScale(25), overflow: "hidden" }}
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
        <BottomSheetTextInput
          placeholder="Entrez votre adresse email"
          onChangeText={setEmail}
          value={email}
          style={{
            marginVertical: verticalScale(20),
            fontFamily: "Thin",

            borderRadius: moderateScale(25),
            fontSize: moderateScale(16),
            lineHeight: 20,
            paddingHorizontal: horizontalScale(30),
            paddingVertical: verticalScale(10),
            backgroundColor: Colors[colorScheme ?? "light"].background,
            ...shadow(1),
          }}
        />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            ...shadow(1),
            paddingHorizontal: horizontalScale(30),
            borderRadius: moderateScale(25),
          }}
        >
          <BottomSheetTextInput
            placeholder="Mot de passe"
            secureTextEntry={true}
            onChangeText={setPassword}
            value={password}
            style={{
              marginVertical: horizontalScale(5),
              fontFamily: "Thin",

              fontSize: moderateScale(16),
              // lineHeight: 20,
              flex: 1,
              paddingVertical: verticalScale(5),
              backgroundColor: Colors[colorScheme ?? "light"].background,
            }}
          />
          <FontAwesome
            name="eye-slash"
            size={moderateScale(23)}
            color={Colors[colorScheme ?? "light"].greyDark}
          />
        </View>

        <View style={{ backgroundColor: "#0000" }}>
          <TextExtraLightItalic
            style={{
              textAlign: "right",
              paddingVertical: verticalScale(10),
              color: Colors[colorScheme ?? "light"].secondaryColour,
            }}
          >
            Mot de passe Oublie ?
          </TextExtraLightItalic>
        </View>

        <TouchableOpacity
          style={{
            alignSelf: "center",
            backgroundColor: Colors[colorScheme ?? "light"].primaryColourLight,
            paddingVertical: verticalScale(5),
            paddingHorizontal: horizontalScale(30),
            borderRadius: 20,
            marginTop: verticalScale(25),
          }}
        >
          <TextRegular
            style={{
              fontSize: moderateScale(18),
              color: Colors[colorScheme ?? "light"].overLay,
            }}
          >
            Connexion
          </TextRegular>
        </TouchableOpacity>
        <TouchableOpacity style={{ marginTop: verticalScale(35) }}>
          <TextRegular
            style={{
              fontSize: moderateScale(15),
              color: Colors[colorScheme ?? "light"].secondaryColour,
              textAlign: "center",
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

export default BottomSheetModal;
