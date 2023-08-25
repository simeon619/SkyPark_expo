import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, useColorScheme } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { formatPostDate } from '../../Utilis/date';
import { horizontalScale, moderateScale, verticalScale } from '../../Utilis/metrics';
import Colors from '../../constants/Colors';
import { SMALL_PIC_USER } from '../../constants/Value';
import { TextLight, TextRegular } from '../StyledText';
import { View } from '../Themed';
import {
  AccountInterface,
  MessageInterface,
  PostInterface,
  ProfileInterface,
} from '../../managementState/server/Descriptions';
import ImageProfile from '../utilis/simpleComponent/ImageProfile';
import { useNavigation, useNavigationState } from '@react-navigation/native';

const CommentHeader = ({
  data,
  user,
  message,
}: {
  data: PostInterface;
  message: MessageInterface | undefined;
  user:
    | {
        account: AccountInterface;
        profile: ProfileInterface;
      }
    | undefined;
}) => {
  const colorScheme = useColorScheme();
  const navigation = useNavigation();
  const nameUser = user?.account.name || 'user' + Math.ceil(Math.random() * 80000000);

  function handleGoToDetail(): void {
    const dataPost = JSON.stringify(data);
    const infoUser = JSON.stringify(user);
    const messageUser = JSON.stringify(message);

    // route.push('/(postDetails)/');
    //@ts-ignore

    // route.push({ pathname: `/postDetails/${data._id}`, params: { dataPost, infoUser, messageUser } });
    navigation.push(`DetailPost`, { dataPost, infoUser, messageUser, id: data._id });

    // navigation.

    // route.push(`/postDetails/${data._id}`);
  }
  // function handleGoToDetail(): void {
  //   route.push(`/pageModal/detailPost`);
  // }
  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: verticalScale(5),
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          flex: 1,
          columnGap: horizontalScale(7),
        }}
      >
        <ImageProfile size={SMALL_PIC_USER + 5} image={user?.profile.imgProfile[0]?.url} />
        <Pressable onPress={handleGoToDetail} style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: 'row',
              flex: 1,
              columnGap: horizontalScale(7),
            }}
          >
            <View style={{ flexShrink: 0, alignSelf: 'flex-start' }}>
              <TextLight
                numberOfLines={2}
                style={{
                  color: Colors[colorScheme ?? 'light'].greyDark,
                  fontSize: moderateScale(15),
                  paddingTop: horizontalScale(1),
                }}
              >
                <TextLight
                  numberOfLines={1}
                  style={{ color: Colors[colorScheme ?? 'light'].text, fontSize: moderateScale(15) }}
                >
                  {nameUser.length > 20 ? `${nameUser.slice(0, 20)}...` : nameUser}
                </TextLight>
              </TextLight>
            </View>
          </View>
          <TextRegular
            style={{
              color: Colors[colorScheme ?? 'light'].greyDark,
              fontSize: moderateScale(14),
            }}
          >
            {formatPostDate(data.__createdAt)}
          </TextRegular>
        </Pressable>
      </View>
      <TouchableOpacity style={{ marginLeft: horizontalScale(1) }}>
        <Ionicons name="ellipsis-vertical" size={24} color={Colors[colorScheme ?? 'light'].greyDark} />
      </TouchableOpacity>
    </View>
  );
};
export default CommentHeader;
