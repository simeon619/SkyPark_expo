import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { useColorScheme } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { formatPostDate } from '../../Utilis/date';
import { horizontalScale, moderateScale, verticalScale } from '../../Utilis/metrics';
import Colors from '../../constants/Colors';
import { SMALL_PIC_USER } from '../../constants/Value';
import { TextLight, TextRegular } from '../StyledText';
import { View } from '../Themed';
import { AccountInterface, PostInterface, ProfileInterface } from '../../managementState/server/Descriptions';
import ImageProfile from '../utilis/simpleComponent/ImageProfile';
import { useRouter } from 'expo-router';

const PostHeader = ({
  data,
  user,
}: {
  data: PostInterface;
  user:
    | {
        account: AccountInterface;
        profile: ProfileInterface;
      }
    | undefined;
}) => {
  const colorScheme = useColorScheme();
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
  const router = useRouter();

  return (
    <View
      style={{
        // flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: verticalScale(5),
        position: 'sticky',
        borderBottomColor: '#0002',
        borderBottomWidth: 1,
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
        <TouchableOpacity style={{ marginLeft: horizontalScale(1) }} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors[colorScheme ?? 'light'].greyDark} />
        </TouchableOpacity>
        <ImageProfile size={SMALL_PIC_USER + 10} image={user?.profile.imgProfile[0]?.url} />
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
      </View>
      {/* <TouchableOpacity style={{ marginLeft: horizontalScale(1) }}>
        <Ionicons name="ellipsis-vertical" size={24} color={Colors[colorScheme ?? 'light'].greyDark} />
      </TouchableOpacity> */}
    </View>
  );
};
export default PostHeader;
