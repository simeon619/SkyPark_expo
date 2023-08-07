import { FontAwesome } from '@expo/vector-icons';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import React, { memo, useState } from 'react';
import { Controller, FieldErrors, UseFormRegister } from 'react-hook-form';
import { View, useColorScheme } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { horizontalScale, moderateScale, shadow, verticalScale } from '../../Utilis/metrics';
import Colors from '../../constants/Colors';
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

export const Input = memo(
  ({ control, placeholder, securePassword, name, defaultyValue, register, errors }: InputRegister) => {
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
  }
);

export const InputBottomSheet = memo(
  ({
    control,
    placeholder,
    securePassword,
    name,
    defaultyValue,
  }: {
    control: any;
    placeholder: string;
    securePassword: boolean;
    name: string;
    defaultyValue?: string;
  }) => {
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
  }
);
