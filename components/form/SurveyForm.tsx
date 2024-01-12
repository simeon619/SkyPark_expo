import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, TextInput, TouchableOpacity, View as ViewNatif } from 'react-native';
import { useNavigation } from '@react-navigation/native';
//@ts-ignore
import InsetShadow from 'react-native-inset-shadow';
import { MagicModalPortal, magicModal } from 'react-native-magic-modal';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { horizontalScale, moderateScale, verticalScale } from '../../Utilis/metrics';
import useToggleStore, { useBlurSurvey, useDaysSurvey, useTypeForm } from '../../managementState/client/preference';
import { useAuthStore } from '../../managementState/server/auth';
import { useThreadPostStore } from '../../managementState/server/post/postThread';
import { TextLight, TextRegular } from '../StyledText';
import { View } from '../Themed';

const SurveyForm = ({ text, setText }: { text: string; setText: React.Dispatch<React.SetStateAction<string>> }) => {
  const { primaryColour, primaryColourLight } = useToggleStore((state) => state);
  const { setBlurSurvey } = useBlurSurvey((state) => state);
  const { IconName } = useTypeForm((state) => state);
  //@ts-ignore
  const { publishPost } = useThreadPostStore((state) => state);
  const { account } = useAuthStore((state) => state);

  const hideForm = useAnimatedStyle(() => {
    return {
      display: IconName === 'Vote' ? 'flex' : 'none',
      opacity: withTiming(IconName === 'Vote' ? 1 : 0),
    };
  }, [IconName]);

  const { daysSurvey, setDaysSurvey } = useDaysSurvey();
  // const timeoutRef = useRef<NodeJS.Timeout>();
  const [options, setOptions] = useState<string[]>(['', '']);
  const nbrOptions = 5;
  // useEffect(() => {
  //   if (options.length === 0) {
  //     timeoutRef.current = setTimeout(() => {
  //       setOptions(['', '']);
  //     });
  //   }

  //   return () => {
  //     if (timeoutRef.current) {
  //       clearTimeout(timeoutRef.current);
  //     }
  //   };
  // }, [options]);
  const navigation = useNavigation();

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleAddOption = () => {
    if (options.length >= nbrOptions) {
      return;
    }
    const newOptions = [...options, ''];
    setOptions(newOptions);
  };
  const handleDeleteOption = (index: number) => {
    if (options.length <= 2) {
      return;
    }
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
  };

  const handleSubmit = () => {
    if (options.length <= 1) {
      return;
    }
    const labels = options.map((option) => {
      return {
        label: option,
      };
    });
    publishPost({
      accountId: account?._id,
      type: '3',
      value: text,
      surveyOptions: {
        delay: 1000 * 60 * 60 * 24 * daysSurvey,
        options: [...labels],
      },
    }, "Thread");
    setText('');
    navigation.goBack();
  };

  const TimePickerSurvey = () => {
    const timesSurveyDays = [{ d: 1 }, { d: 2 }, { d: 3 }, { d: 4 }, { d: 5 }, { d: 6 }, { d: 7 }];
    return (
      <LinearGradient
        colors={['#FFA7A933', '#fefefe33']}
        locations={[0, 0.6]}
        style={{
          position: 'absolute',
          left: horizontalScale(5),
          zIndex: 99,
          right: horizontalScale(5),
          bottom: verticalScale(80),
          padding: moderateScale(10),
          borderRadius: 10,
        }}
      >
        <View>
          {timesSurveyDays.map(({ d }, i) => (
            <ViewNatif
              onTouchStart={() => {
                setDaysSurvey(d);
                magicModal.hide();
              }}
              key={i}
              style={{
                flexDirection: 'row',
                paddingVertical: verticalScale(7),
                alignItems: 'center',
                justifyContent: 'flex-start',
              }}
            >
              <ViewNatif
                style={{
                  width: moderateScale(19),
                  aspectRatio: 1,
                  borderRadius: 100,
                  borderWidth: 1,
                  borderColor: '#0009',
                  backgroundColor: daysSurvey === d ? primaryColour : '#0000',
                }}
              />
              <TextLight style={{ fontSize: moderateScale(17), paddingTop: verticalScale(5) }}>
                <TextLight> {d} </TextLight>
                <TextLight>jour{d > 1 ? 's' : ''} </TextLight>{' '}
              </TextLight>
            </ViewNatif>
          ))}
        </View>
        {/* </TouchableWithoutFeedback> */}
      </LinearGradient>
    );
  };

  return (
    <Animated.View style={{ ...hideForm }}>
      <KeyboardAvoidingView
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 100}
        behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
      >
        <View style={{ marginLeft: moderateScale(50), marginRight: moderateScale(20) }}>
          <TextRegular
            style={{
              fontSize: moderateScale(15),
              color: 'grey',
              marginHorizontal: horizontalScale(10),
              marginTop: verticalScale(10),
            }}
          >
            Options du sondage
          </TextRegular>
          {options.map((option, index, array) => {
            let textPlaceholder = 'Option ' + (index + 1);
            return (
              <View
                key={index}
                style={{
                  flexDirection: 'row-reverse',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {index >= 2 ? (
                  <FontAwesome
                    name="close"
                    size={24}
                    style={{ padding: 10 }}
                    onPress={() => {
                      handleDeleteOption(index);
                    }}
                  />
                ) : (
                  <View style={{ padding: 0 }} />
                )}
                <TextInput
                  key={index}
                  autoFocus={index >= 2 ? true : false}
                  maxLength={150}
                  style={{
                    borderColor: '#1113',
                    fontFamily: 'Light',
                    borderWidth: 1,
                    flex: 1,
                    fontSize: moderateScale(15),
                    paddingVertical: verticalScale(5),
                    paddingHorizontal: horizontalScale(15),
                    borderRadius: moderateScale(50),
                    marginBottom: array.length - 1 === index ? 0 : verticalScale(15),
                    textAlignVertical: 'center',
                  }}
                  placeholder={textPlaceholder}
                  value={option}
                  onChangeText={(value) => handleOptionChange(index, value)}
                />
              </View>
            );
          })}
          {options.length < nbrOptions && (
            <TouchableOpacity
              style={{
                borderWidth: 1,
                borderColor: '#1113',
                paddingHorizontal: horizontalScale(18),
                paddingVertical: verticalScale(5),
                borderRadius: moderateScale(50),
                marginVertical: verticalScale(10),
              }}
              onPress={handleAddOption}
            >
              <TextLight style={{ fontSize: moderateScale(16), color: '#1113' }}>Ajouter une option...</TextLight>
            </TouchableOpacity>
          )}
        </View>
        {nbrOptions - options.length > 0 && (
          <View style={{ height: 25, backgroundColor: primaryColourLight }}>
            <InsetShadow>
              <View style={{ flex: 1, backgroundColor: 'transparent' }}>
                <TextLight style={{ fontSize: moderateScale(14), textAlign: 'center' }}>
                  Vous pouvez ajoutez encore {nbrOptions - options.length} option
                  {nbrOptions - options.length > 1 ? 's' : ''}
                </TextLight>
              </View>
            </InsetShadow>
          </View>
        )}

        <View
          style={{
            marginLeft: moderateScale(5),
            flexDirection: 'row',
            columnGap: moderateScale(5),
            paddingVertical: verticalScale(15),
          }}
        >
          <TextLight style={{ fontSize: moderateScale(16) }}>Duree du sondage :</TextLight>

          <TouchableOpacity
            onPress={() => {
              magicModal.show(TimePickerSurvey, {
                useNativeDriver: true,
                animationIn: 'slideInUp',
                animationOut: 'slideOutDown',
                animationInTiming: 600,
                animationOutTiming: 600,
                backdropTransitionOutTiming: 500,
                backdropOpacity: 0,
                useNativeDriverForBackdrop: true,
                onModalHide() {
                  setBlurSurvey(0);
                },
                onModalShow() {
                  setBlurSurvey(1);
                },
              });
            }}
          >
            <TextLight
              style={{
                flex: 1,
                textAlign: 'left',
                color: primaryColour,
                fontSize: moderateScale(17),
              }}
            >
              {daysSurvey} jour{daysSurvey > 1 ? 's' : ''}
            </TextLight>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            marginRight: moderateScale(20),
            columnGap: moderateScale(10),
          }}
        >
          <TouchableOpacity onPress={handleSubmit} style={{}}>
            <TextRegular style={{ color: 'grey', fontSize: moderateScale(15) }}>Valider</TextRegular>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}}>
            <TextRegular style={{ color: 'grey', fontSize: moderateScale(15) }}>Annuler</TextRegular>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      <MagicModalPortal />
    </Animated.View>
  );
};

export default SurveyForm;
