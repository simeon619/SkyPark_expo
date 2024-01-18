import { Image } from 'expo-image';
import React, { useState } from 'react';
import { useColorScheme } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { horizontalScale, moderateScale, verticalScale } from '../../Utilis/metrics';
import Colors from '../../constants/Colors';
import useToggleStore from '../../managementState/client/preference';
import { View } from '../Themed';
import { TextInput } from 'react-native';

const SearchGroup = ({ setText }: { setText: (text: string) => void }) => {
  const colorScheme = useColorScheme();
  const { primaryColourLight } = useToggleStore((state) => state);
  const data = [
    { label: 'Post---Neighborhodd', value: '2' },
    { label: 'Post---Building', value: '3' },
  ];
  const [value, setValue] = useState<string>();
  const [isFocus, setIsFocus] = useState(false);

  return (
    <View style={{ rowGap: verticalScale(10), marginTop: verticalScale(25) }}>
      <View
        style={{
          flexDirection: 'row',
          marginHorizontal: moderateScale(10),
          borderColor: primaryColourLight,
          borderWidth: 1,
          paddingVertical: moderateScale(5),
          borderRadius: moderateScale(6),
          paddingHorizontal: moderateScale(7),
          backgroundColor: Colors[colorScheme ?? 'light'].lightGrey,
        }}
      >
        <TextInput
          placeholder={'Search Groups'}
          onChangeText={(text) => setText(text)}
          style={{
            flex: 1,
            fontSize: moderateScale(15),
            fontFamily: 'Light',
          }}
        />
        <Image
          source={require('../../assets/icon/search.png')}
          style={{
            width: moderateScale(22),
            aspectRatio: 1,
            tintColor: primaryColourLight,
          }}
          transition={200}
        />
      </View>

      <Dropdown
        style={[
          {
            // height: 50,
            borderColor: primaryColourLight,
            borderWidth: 1,
            borderRadius: moderateScale(6),
            paddingHorizontal: horizontalScale(10),
            marginHorizontal: horizontalScale(10),
            backgroundColor: Colors[colorScheme ?? 'light'].lightGrey,
          },
          isFocus && { borderColor: primaryColourLight },
        ]}
        placeholderStyle={{
          fontSize: 16,
          fontFamily: 'Thin',
        }}
        selectedTextStyle={{
          fontSize: 16,
          fontFamily: 'Thin',
        }}
        iconStyle={{
          width: 20,
          height: 20,
        }}
        data={data}
        maxHeight={200}
        labelField="label"
        valueField="value"
        placeholder={!isFocus ? 'select Categorie' : '...'}
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(item) => {
          setValue(item.value);
          setIsFocus(false);
        }}
      />
    </View>
  );
};
export default SearchGroup;
