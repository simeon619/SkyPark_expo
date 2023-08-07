import { KeyboardTypeOptions, TextInput, useColorScheme } from 'react-native';
import { horizontalScale, moderateScale, shadow, verticalScale } from '../../../Utilis/metrics';
import Colors from '../../../constants/Colors';

const createInput = ({
  placeholder,
  typeKeyboard = 'default',
  value,
  setValue,
  securePassword = false,
}: {
  placeholder: string;
  typeKeyboard?: KeyboardTypeOptions;
  value: string;
  setValue: any;
  securePassword?: boolean;
}) => {
  const colorScheme = useColorScheme();
  return (
    <TextInput
      placeholder={placeholder}
      onChangeText={setValue}
      value={value}
      secureTextEntry={securePassword}
      keyboardType={typeKeyboard}
      style={{
        marginVertical: verticalScale(15),
        fontFamily: 'Thin',

        borderRadius: moderateScale(25),
        fontSize: moderateScale(16),
        lineHeight: 20,
        paddingHorizontal: horizontalScale(30),
        paddingVertical: verticalScale(10),
        backgroundColor: Colors[colorScheme ?? 'light'].background,
        ...shadow(1),
      }}
    />
  );
};

export default createInput;
