import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Pressable, TouchableWithoutFeedback, useColorScheme } from 'react-native';
import { formatPostDate } from '../../Utilis/date';
import { horizontalScale, moderateScale, shadow, verticalScale } from '../../Utilis/metrics';
import Colors from '../../constants/Colors';
import { SMALL_PIC_USER } from '../../constants/Value';
import {
  AccountInterface,
  MessageInterface,
  PostInterface,
  ProfileInterface,
} from '../../managementState/server/Descriptions';
import { TextLight, TextRegular } from '../StyledText';
import { View } from '../Themed';
import ImageProfile from '../utilis/simpleComponent/ImageProfile';

import { Menu, MenuOption, MenuOptions, MenuTrigger } from 'react-native-popup-menu';
import { useMenuDiscussionIsOpen } from '../../managementState/client/preference';
import ItemMenu from '../discussion/ItemMenu';

const PostHeader = ({
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
  const { toggleValue } = useMenuDiscussionIsOpen((state) => state);

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
        </Pressable>
      </View>
      <TouchableWithoutFeedback style={{ marginLeft: horizontalScale(1) }}>
        <Menu onClose={toggleValue} onOpen={toggleValue}>
          <MenuTrigger
            children={<Ionicons name="ellipsis-vertical" size={24} color={Colors[colorScheme ?? 'light'].greyDark} />}
          />
          <MenuOptions
            optionsContainerStyle={{
              borderRadius: moderateScale(20),
              width: 'auto',
              paddingHorizontal: horizontalScale(15),
              ...shadow(92),
            }}
          >
            <MenuOption onSelect={() => alert(`Delete`)}>
              <ItemMenu value="Favourite" />
            </MenuOption>
            <MenuOption onSelect={() => alert(`Delete`)}>
              <ItemMenu value="Supprimer" />
            </MenuOption>
          </MenuOptions>
        </Menu>
      </TouchableWithoutFeedback>
    </View>
  );
};
export default PostHeader;
