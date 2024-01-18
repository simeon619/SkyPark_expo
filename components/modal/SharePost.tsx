import { ScrollView, TextInput, ToastAndroid, TouchableOpacity } from 'react-native';
import { moderateScale } from '../../Utilis/metrics';
import { useListUserStore } from '../../managementState/server/Listuser';

import React, { useEffect, useMemo, useState } from 'react';
import ImageProfile from '../utilis/simpleComponent/ImageProfile';
import { TextRegular } from '../StyledText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SQuery } from '../../managementState';
import { useNavigation } from '@react-navigation/native';

const SharePost = ({ route }: any) => {
  const { listAccount, getListAccount } = useListUserStore((state) => state);
  const [text, setText] = useState('');
  const filteredList = useMemo(
    () => listAccount.filter((item) => item?.account?.name?.toLowerCase().includes(text.toLowerCase())),
    [text, listAccount]
  );

  const navigation = useNavigation();
  const params = route.params as any as {
    postId: string;
  };
  const showToast = () => {
    ToastAndroid.show('Post partager avec Succes', ToastAndroid.LONG);
  };
  const sharedAcount = async (id: string) => {
    await SQuery.service('post', 'statPost', {
      postId: params?.postId,
      accountShared: id,
    });
    navigation.goBack();
    showToast();
  };
  useEffect(() => {
    if (listAccount.length > 0) return;
    getListAccount();
  }, [listAccount]);
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: 'white',
        padding: moderateScale(10),
      }}
    >
      <TextInput placeholder="Search" onChangeText={setText} />
      <ScrollView style={{}}>
        {listAccount && listAccount.length > 0 ? (
          filteredList.map((item) => {
            return (
              <TouchableOpacity
                onPress={() => sharedAcount(item?.account._id as string)}
                key={item?.account._id}
                style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}
              >
                <ImageProfile image={item?.profile.imgProfile[0]?.url} size={moderateScale(45)} />
                <TextRegular style={{ marginLeft: 10, fontSize: moderateScale(15) }}>{item?.account.name}</TextRegular>
              </TouchableOpacity>
            );
          })
        ) : (
          <TextRegular>No accounts available</TextRegular>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default SharePost;
