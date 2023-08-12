import { BlurView } from 'expo-blur';
import { usePathname, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, useColorScheme, useWindowDimensions } from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { horizontalScale, moderateScale, shadow, verticalScale } from '../../Utilis/metrics';
import { View } from '../../components/Themed';
import SurveyForm from '../../components/form/SurveyForm';
import DefaultForm from '../../components/form/defaultForm';
import ImageProfile from '../../components/utilis/simpleComponent/ImageProfile';
import Colors from '../../constants/Colors';
import { SMALL_PIC_USER, formTextPlaceholder } from '../../constants/Value';
import { useBlurSurvey, useTypeForm } from '../../managementState/client/preference';
import { useAuthStore } from '../../managementState/server/auth';

const post = () => {
  const colorScheme = useColorScheme();
  const [heightInput, setHeightInput] = useState(40);
  const route = useRouter();
  const { blurSurvey } = useBlurSurvey((state) => state);
  const { IconName } = useTypeForm((state) => state);
  const refInput = React.useRef<TextInput>(null);

  const { profile } = useAuthStore((state) => state);

  console.log('🚀 ~ file: post.tsx:29 ~ post: ~ profile:', profile?.imgProfile);

  const { width, height } = useWindowDimensions();
  useEffect(() => {
    refInput.current?.focus();
  }, [usePathname()]);
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors[colorScheme ?? 'light'].background,
      }}
    >
      <BlurView style={[{ zIndex: blurSurvey }, StyleSheet.absoluteFill]} />
      <View
        style={[
          {
            borderRadius: 25,
            backgroundColor: Colors[colorScheme ?? 'light'].background,
            marginHorizontal: horizontalScale(15),
            marginTop: verticalScale(15),
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
            onPress={() => {
              route.push('/profile/');
            }}
          >
            <ImageProfile image={profile?.imgProfile[0]?.url} size={SMALL_PIC_USER + 10} />

            {/* <Image
              style={{
                width: moderateScale(SMALL_PIC_USER + 5),
                aspectRatio: 1,
                marginHorizontal: moderateScale(5),
                borderRadius: SMALL_PIC_USER / 2,
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
          </TouchableOpacity>

          <TextInput
            multiline={true}
            numberOfLines={2}
            onContentSizeChange={(e) => {
              setHeightInput(e.nativeEvent.contentSize.height);
            }}
            ref={refInput}
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
        <DefaultForm />
        <SurveyForm />
      </View>
      {/* <TimePickerSurvey /> */}
    </SafeAreaView>
  );
};

export default React.memo(post);
