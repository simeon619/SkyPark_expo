import React, { useEffect } from 'react';
import { TouchableOpacity, ViewStyle, useColorScheme } from 'react-native';

import { useRouter } from 'expo-router';
import { UseFormHandleSubmit } from 'react-hook-form';
import { horizontalScale, moderateScale, verticalScale } from '../../../Utilis/metrics';
import { ValidationSchema } from '../../../app/register/Signup';
import Colors from '../../../constants/Colors';
import { useAuthStore } from '../../../managementState/server/auth';
import { TextRegular } from '../../StyledText';

const createButton = ({
  value,
  onPress,
  style,
}: {
  value: string;
  onPress: UseFormHandleSubmit<ValidationSchema>;
  style?: ViewStyle;
}) => {
  const colorScheme = useColorScheme();

  const { address, profile, user, loading, fetchRegister } = useAuthStore();
  const router = useRouter();
  const createUser = (data: any) => {
    console.log({ data });

    fetchRegister(data);
  };

  useEffect(() => {
    console.log({ user: user?._id, address: address?._id, profile: profile?._id });

    if (user?._id && address?._id && profile?._id) {
      //@ts-ignore
      router.replace('/(tabs)/_layout');
    }
  });

  return (
    <TouchableOpacity
      onPress={onPress(createUser)}
      style={{
        alignSelf: 'center',
        backgroundColor: Colors[colorScheme ?? 'light'].primaryColour,
        paddingVertical: verticalScale(5),
        paddingHorizontal: horizontalScale(30),
        borderRadius: 20,
        marginTop: verticalScale(25),

        ...style,
      }}
    >
      <TextRegular
        style={{
          fontSize: moderateScale(15),
          color: Colors[colorScheme ?? 'light'].overLay,
          textTransform: 'capitalize',
        }}
      >
        {value}
      </TextRegular>
    </TouchableOpacity>
  );
};

export default createButton;
