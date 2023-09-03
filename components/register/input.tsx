import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import React, { useCallback, useState } from 'react';
import { Controller, FieldErrors, UseFormRegister } from 'react-hook-form';
import { TextInput, TouchableOpacity, View, useColorScheme } from 'react-native';

import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { pickImage } from '../../Utilis/functions/media/media';
import { horizontalScale, moderateScale, shadow, verticalScale } from '../../Utilis/metrics';
import Colors from '../../constants/Colors';
import { sendMessage } from '../../managementState/server/Discussion';
import { TextExtraLight } from '../StyledText';

type InputProps = {
  email: string;
  password: string;
  confirmedPassword: string;
  code: string;
};

type InputRegister = {
  control: any;
  placeholder: string;
  securePassword: boolean;
  name: 'email' | 'password' | 'confirmedPassword' | 'code';
  defaultyValue?: string;
  register: UseFormRegister<InputProps>;
  errors: FieldErrors<InputProps>;
};

export const Input = ({
  control,
  placeholder,
  securePassword,
  name,
  defaultyValue,
  register,
  errors,
}: InputRegister) => {
  const colorScheme = useColorScheme();
  const [showPassword, setShowPassword] = useState(securePassword);
  return (
    <>
      <Controller
        control={control}
        name={name}
        defaultValue={defaultyValue}
        render={({ field: { onChange, value } }: { field: any }) => (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              borderRadius: moderateScale(25),
              paddingHorizontal: horizontalScale(30),
              marginVertical: verticalScale(10),
              borderColor: Colors[colorScheme ?? 'light'].greyDark,
              paddingVertical: verticalScale(10),
              backgroundColor: Colors[colorScheme ?? 'light'].background,
              ...shadow(1),
            }}
          >
            <TextInput
              placeholder={placeholder}
              onChangeText={onChange}
              value={value}
              {...register(name)}
              secureTextEntry={showPassword}
              style={{
                fontFamily: 'Thin',
                fontSize: moderateScale(16),
                flex: 1,
              }}
            />
            {securePassword && (
              <FontAwesome
                name={showPassword ? 'eye-slash' : 'eye'}
                size={moderateScale(23)}
                onPress={() => setShowPassword((prev) => !prev)}
                color={Colors[colorScheme ?? 'light'].greyDark}
              />
            )}
          </View>
        )}
      />
      {!!errors[name]?.message && (
        <TextExtraLight
          style={{ fontSize: moderateScale(15), color: Colors[colorScheme ?? 'light'].error, textAlign: 'center' }}
        >
          {errors[name]?.message}
        </TextExtraLight>
      )}
    </>
  );
};

type InputBottomSheetProps = {
  control: any;
  placeholder: string;
  securePassword: boolean;
  name: string;
  defaultyValue?: string;
};

export const InputBottomSheet = ({
  control,
  placeholder,
  securePassword,
  name,
  defaultyValue,
}: InputBottomSheetProps) => {
  const colorScheme = useColorScheme();
  const [showPassword, setShowPassword] = useState(securePassword);
  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultyValue}
      render={({ field: { onChange, value } }: { field: any }) => (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            borderRadius: moderateScale(25),
            paddingHorizontal: horizontalScale(30),
            marginVertical: verticalScale(10),
            paddingVertical: verticalScale(10),
            backgroundColor: Colors[colorScheme ?? 'light'].background,
            ...shadow(1),
          }}
        >
          <BottomSheetTextInput
            placeholder={placeholder}
            onChangeText={onChange}
            value={value}
            secureTextEntry={showPassword}
            style={{
              fontFamily: 'Thin',
              fontSize: moderateScale(16),
              flex: 1,
            }}
          />
          {securePassword && (
            <FontAwesome
              name={showPassword ? 'eye-slash' : 'eye'}
              size={moderateScale(23)}
              onPress={() => setShowPassword((prev) => !prev)}
              color={Colors[colorScheme ?? 'light'].greyDark}
            />
          )}
        </View>
      )}
    />
  );
};

// const regex = new RegExp(/[^\s\r\n]/g);
export const InputTextMessage = ({
  placeholder,
  startRecording,
  accountId,
}: {
  placeholder: string;
  startRecording: () => void;
  accountId: string;
}) => {
  const colorScheme = useColorScheme();
  const heightAnim = useSharedValue(0);

  const [text, setText] = useState('');
  const animatedStyles = useAnimatedStyle(() => {
    return {
      height: heightAnim.value,
      // maxHeight: verticalScale(),
    };
  });
  const handleContentSizeChange = useCallback((event: any) => {
    const newHeight = Math.min(Math.max(event.nativeEvent.contentSize.height, 30), verticalScale(110));
    heightAnim.value = withTiming(newHeight, { duration: 0 });
  }, []);

  return (
    <View
      style={{
        flexDirection: 'row',
        flex: 1,
        backgroundColor: '#0002',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: horizontalScale(10),
        borderRadius: 84,
        paddingVertical: verticalScale(5),
      }}
    >
      <Animated.View
        style={[
          animatedStyles,
          {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          },
        ]}
      >
        <TextInput
          placeholder={placeholder}
          placeholderTextColor={Colors[colorScheme ?? 'light'].text}
          multiline={true}
          onChangeText={setText}
          value={text}
          onContentSizeChange={handleContentSizeChange}
          style={{
            fontSize: moderateScale(17),
            color: Colors[colorScheme ?? 'light'].text,
            fontFamily: 'Thin',
            paddingVertical: verticalScale(2),
            paddingHorizontal: horizontalScale(20),
            flex: 5,
            marginLeft: horizontalScale(5),
          }}
        />
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: '#0000',
            flex: 1,
            marginRight: horizontalScale(35),
            gap: horizontalScale(10),
          }}
        >
          <TouchableOpacity
            onPress={async () => {
              if (!text) {
                let images = await pickImage({ numberImages: 1 });

                let files = images?.map((image) => {
                  return image.PrepareImage;
                });
                sendMessage({ accountId: accountId, files });
              }
            }}
            style={{}}
          >
            <Ionicons name="add-circle" size={28} color={Colors[colorScheme ?? 'light'].accent} />
          </TouchableOpacity>

          <View
            style={{
              backgroundColor: '#0000',
            }}
          >
            {!!text ? (
              <TouchableOpacity
                onPress={() => {
                  sendMessage({
                    accountId: accountId,
                    value: text,
                  });
                  setText('');
                }}
              >
                <Ionicons name="send" size={25} color={Colors[colorScheme ?? 'light'].messageColourLight} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[{}]}
                onPress={() => {
                  startRecording();
                }}
              >
                <MaterialIcons
                  name={'keyboard-voice'}
                  size={27}
                  color={Colors[colorScheme ?? 'light'].messageColourLight}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Animated.View>
    </View>
  );
};
