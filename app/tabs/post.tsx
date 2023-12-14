import { BlurView } from 'expo-blur';

import React, { useEffect, useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, useColorScheme, useWindowDimensions } from 'react-native';
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
import { useFocusEffect } from '@react-navigation/native';
import ActionButtonForm from '../../components/utilis/ActionButtonForm';

const PostTabScreen = () => {
  const colorScheme = useColorScheme();
  const [heightInput, setHeightInput] = useState(40);

  const { blurSurvey } = useBlurSurvey((state) => state);
  const { IconName } = useTypeForm((state) => state);
  const refInput = React.useRef<TextInput>(null);
  const [text, setText] = useState('');

  const { profile } = useAuthStore((state) => state);

  const { width, height } = useWindowDimensions();
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
            onPress={() => {
              // navigation.navigate('');
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
            onChangeText={setText}
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
      </View>
    </SafeAreaView>
  );
};

export default PostTabScreen;
