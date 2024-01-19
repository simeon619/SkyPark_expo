import React, { useEffect, useMemo } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View } from '../../components/Themed';
import Colors from '../../constants/Colors';

import { useNavigation } from '@react-navigation/native';
import { Image } from 'expo-image';
import { ScrollView, TextInput, TouchableOpacity, useColorScheme, useWindowDimensions } from 'react-native';
import { horizontalScale, moderateScale, verticalScale } from '../../Utilis/metrics';
import useToggleStore from '../../managementState/client/preference';
import useFindThem, { UserProfile } from '../../managementState/server/FindThem';
import { TextMedium } from '../../components/StyledText';

const Search = () => {
  const { width } = useWindowDimensions();
  const colorScheme = useColorScheme();
  const [value, setValue] = React.useState('');
  const { primaryColour } = useToggleStore((state) => state);
  const { getList, listAccount, listForum, listPost, listActivity } = useFindThem((state) => state);

  console.log({
    listAccount,
    listForum,
    listPost,
    listActivity,
  });

  useMemo(() => {
    getList({ value });
  }, [value]);

  const navigation = useNavigation();
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          width,
          backgroundColor: primaryColour,
          // backgroundColor: "blue",
          paddingHorizontal: horizontalScale(10),
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: verticalScale(5),
        }}
      >
        <TouchableOpacity
          onPress={() => {
            //@ts-ignore
            navigation.navigate('Profile');
          }}
        >
          <Image
            source={require('../../assets/icon/menu.png')}
            style={{
              height: moderateScale(28),
              aspectRatio: 1,
              marginTop: 3,
              tintColor: Colors[colorScheme ?? 'light'].overLay,
              transform: [{ rotate: '180deg' }],
              // backgroundColor: "red",
            }}
          />
        </TouchableOpacity>

        <TextInput
          placeholder="Search..."
          placeholderTextColor={Colors[colorScheme ?? 'light'].overLay}
          onChangeText={(text) => setValue(text)}
          autoFocus
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            height: moderateScale(28),
            borderBottomWidth: 1,
            gap: horizontalScale(10),
            marginHorizontal: horizontalScale(15),
            borderBottomColor: Colors[colorScheme ?? 'light'].overLay,
            backgroundColor: primaryColour,
            paddingHorizontal: horizontalScale(10),
            fontSize: moderateScale(17),
            color: 'white',
            paddingVertical: verticalScale(5),
          }}
        />
      </View>
      <ScrollView>
        {listAccount && listAccount.map((item: any) => <ItemSearchAccount key={item._id} item={item} />)}
      </ScrollView>
    </SafeAreaView>
  );
};

const ItemSearchAccount = ({ item }: { item: UserProfile }) => {
  const { primaryColour } = useToggleStore((state) => state);
  const colorScheme = useColorScheme();
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => {
        //@ts-ignore
        navigation.navigate('Profile');
      }}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: verticalScale(10),
        borderBottomWidth: 1,
        borderBottomColor: 'black',
      }}
    >
      <View
        style={{
          width: '20%',
          alignItems: 'center',
          height: 3,
          borderRadius: 5,
          backgroundColor: 'black',
          marginBottom: verticalScale(9),
        }}
      />
      <View
        lightColor="#0000"
        darkColor="#0000"
        style={{
          width: '80%',
          flexDirection: 'row',
          alignItems: 'center',
          gap: horizontalScale(10),
        }}
      >
        <Image
          source={require('../../assets/icon/menu.png')}
          style={{
            height: moderateScale(28),
            aspectRatio: 1,
            tintColor: 'black',
          }}
        />
        <TextMedium
          style={{
            color: 'black',
          }}
        >
          {item.name}
        </TextMedium>
      </View>
    </TouchableOpacity>
  );
};

export default Search;
