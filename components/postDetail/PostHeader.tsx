import React from 'react';
import { TouchableOpacity, useColorScheme } from 'react-native';
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
import { useNavigation } from '@react-navigation/native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

const PostHeader = ({
  data,
  user,
  message,
}: {
  data: PostInterface;
  user:
    | {
        account: AccountInterface;
        profile: ProfileInterface;
      }
    | undefined;
  message: MessageInterface;
}) => {
  const colorScheme = useColorScheme();
  const navigation = useNavigation();
  const nameUser = user?.account.name || 'user' + Math.ceil(Math.random() * 80000000);
  const typePost = (type: string) => {
    if (type === '1') {
      return 'a postez un avis';
    }
    if (type === '2') {
      return 'a postez un media';
    }
    if (type === '3') {
      return 'a postez un sondage';
    }
    // if (type === '4') {
    //   content.groupJoin?.name;
    //   return (
    //     <TextLight>
    //       <TextLight style={{ color: Colors[colorScheme ?? 'light'].greyDark }}>a rejoint le groupe </TextLight>{' '}
    //       <TextMedium>{content.groupJoin?.name}</TextMedium>{' '}
    //     </TextLight>
    //   );
    // }
  };

  function handleGoToDetail(): void {
    const dataPost = JSON.stringify(data);
    const infoUser = JSON.stringify(user);
    const messageUser = JSON.stringify(message);

    //@ts-ignore
    navigation.navigate('DetailPost', { dataPost, infoUser, messageUser, id: data._id });
  }
  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: verticalScale(5),
        // position: 'absolute',
        // top: 0,
        // left: 0,
        // right: 0,
        // borderBottomColor: '#0002',
        // borderBottomWidth: 1,
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
        <ImageProfile size={SMALL_PIC_USER + 10} image={user?.profile.imgProfile[0]?.url} />
        <TouchableWithoutFeedback onPress={handleGoToDetail} style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
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
                  </TextLight>{' '}
                  {typePost(data.type)}
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
          </View>
        </TouchableWithoutFeedback>
      </View>
      {/* <TouchableOpacity style={{ marginLeft: horizontalScale(1) }}>
        <Ionicons name="ellipsis-vertical" size={24} color={Colors[colorScheme ?? 'light'].greyDark} />
      </TouchableOpacity> */}
    </View>
  );
};
export default PostHeader;
