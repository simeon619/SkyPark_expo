import { BlurView } from 'expo-blur';

import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, useColorScheme, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { horizontalScale, moderateScale, shadow, verticalScale } from '../../Utilis/metrics';
import { View } from '../../components/Themed';
import SurveyForm from '../../components/form/SurveyForm';
import DefaultForm from '../../components/form/defaultForm';
import ImageProfile from '../../components/utilis/simpleComponent/ImageProfile';
import Colors from '../../constants/Colors';
import { SMALL_PIC_USER, formTextPlaceholder } from '../../constants/Value';
import useToggleStore, { useBlurSurvey, useTypeForm } from '../../managementState/client/preference';
import { useAuthStore } from '../../managementState/server/auth';
import { useFocusEffect } from '@react-navigation/native';
import ActionButtonForm from '../../components/utilis/ActionButtonForm';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { TextMedium } from '../../components/StyledText';
import { useListUserStore } from '../../managementState/server/Listuser';
import ForumForm from '../../components/form/forumForm';

const PostTabScreen = () => {
  const colorScheme = useColorScheme();
  const [heightInput, setHeightInput] = useState(40);
  const size = useSharedValue(100);
  const { blurSurvey } = useBlurSurvey((state) => state);
  const { IconName } = useTypeForm((state) => state);
  const refInput = React.useRef<TextInput>(null);
  const [text, setText] = useState('');
  const [mention, setMention] = useState('');
  const [correspondance, setCorrespondance] = useState('');
  const { primaryColourLight } = useToggleStore((state) => state);

  const { profile } = useAuthStore((state) => state);
  const { listAccount, getListAccount } = useListUserStore();

  const { width, height } = useWindowDimensions();

  useMemo(() => {
    const regexDernierMotArobase = /@\w+\b/g;
    const motMatches = text.match(regexDernierMotArobase);
    if (motMatches) {
      const lastWord = motMatches.pop()!;
      const newtext = text.replace(lastWord, mention);
      setText(newtext);
    }
  }, [mention]);
  const filteredAccount = useMemo(() => {
    if (!correspondance) {
      return listAccount;
    }
    return listAccount.filter((acc) => {
      return acc?.account.name.toLowerCase().includes(correspondance.substring(2, correspondance.length).toLowerCase());
    });
  }, [listAccount, correspondance]);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: withTiming(size.value > 0 ? width * 0.6 : 0, { duration: 450, easing: Easing.inOut(Easing.ease) }), // size.value > 0 ? width * 0.6 : 0,
      height: size.value * filteredAccount.length,
      opacity: withTiming(size.value > 0 ? 1 : 0, { duration: 250, easing: Easing.inOut(Easing.ease) }), // size.value > 0 ? 1 : 0,
    };
  });
  useEffect(() => {
    const regex = /\s@[\w]*\S$/i;
    if (!startAnimation) {
      return;
    }
    if (regex.test(text)) {
      let coresp = text.match(regex)!;

      setCorrespondance(coresp[0]);
      startAnimation(40);
    } else {
      startAnimation(0);
    }
  }, [text]);
  useEffect(() => {
    getListAccount();
  }, []);

  const onTextChange = (value: string) => {
    setText(() => {
      return value.startsWith('@') ? ' ' + value.trimStart() : value;
    });
  };

  const startAnimation = (newSize: number) => {
    size.value = withTiming(newSize, { duration: 250, easing: Easing.inOut(Easing.ease) });
  };

  useFocusEffect(() => {
    refInput.current?.focus();
  });
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors[colorScheme ?? 'light'].background,
      }}
    >
      <BlurView style={[{ zIndex: blurSurvey }, StyleSheet.absoluteFill]} />
      <ActionButtonForm />

      <View
        style={[
          {
            borderRadius: 25,
            backgroundColor: Colors[colorScheme ?? 'light'].background,
            marginHorizontal: horizontalScale(15),
            marginTop: verticalScale(3),
            paddingTop: verticalScale(15),
            ...shadow(5),
            overflow: 'hidden',
          },
        ]}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-start',
          }}
        >
          <TouchableOpacity
            style={{
              alignSelf: 'center',
            }}
          >
            <ImageProfile image={profile?.imgProfile[0]?.url} size={SMALL_PIC_USER + 10} />
          </TouchableOpacity>
          <TextInput
            multiline={true}
            numberOfLines={2}
            onContentSizeChange={(e) => {
              setHeightInput(e.nativeEvent.contentSize.height);
            }}
            ref={refInput}
            value={text}
            onChangeText={onTextChange}
            textAlignVertical="bottom"
            placeholder={formTextPlaceholder(IconName)}
            style={{
              fontSize: moderateScale(15),
              height: heightInput,
              maxHeight: height * 0.3,
              width: width * 0.7,
              fontFamily: 'Light',
              borderWidth: 1,
              borderColor: '#1113',
              paddingHorizontal: horizontalScale(20),
              paddingVertical: verticalScale(10),
              borderRadius: moderateScale(50),
            }}
          />
        </View>
        <DefaultForm text={text} setText={setText} />
        <SurveyForm text={text} setText={setText} />
        <ForumForm text={text} setText={setText} />
        <Animated.View
          style={[
            {
              position: 'absolute',
              zIndex: 99,
              top: Math.min(7 + heightInput, height * 0.3),
              left: 70,
              backgroundColor: '#fff9',
              borderWidth: 1,
              borderColor: primaryColourLight,
              borderRadius: 10,
              padding: 5,
            },
            animatedStyle,
          ]}
        >
          {filteredAccount?.map((acc, i) => {
            return (
              <TouchableOpacity
                key={i}
                onPress={() => setMention(`@${acc?.account.name}`)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  paddingVertical: 3,
                }}
              >
                <ImageProfile size={0} image={undefined} />
                <ImageProfile size={25} image={acc?.profile.imgProfile[0]?.url} />

                <TextMedium
                  style={{ fontSize: moderateScale(15), color: Colors[colorScheme ?? 'light'].text, paddingLeft: 5 }}
                  key={i}
                  numberOfLines={1}
                >
                  {acc?.account.name}
                </TextMedium>
              </TouchableOpacity>
            );
          })}
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

export default PostTabScreen;
