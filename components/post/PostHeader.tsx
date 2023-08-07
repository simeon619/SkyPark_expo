import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React from 'react';
import { useColorScheme, useWindowDimensions } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { formatPostDate } from '../../Utilis/date';
import { horizontalScale, moderateScale, verticalScale } from '../../Utilis/metrics';
import Colors from '../../constants/Colors';
import { SMALL_PIC_USER } from '../../constants/Value';
import { ContentSchema, User } from '../../types/PostType';
import { TextLight, TextMedium, TextRegular } from '../StyledText';
import { View } from '../Themed';

const PostHeader = ({
  date,
  user,
  type,
  content,
}: {
  date: Date;
  user: User;
  type: string;
  content: ContentSchema;
}) => {
  const { width } = useWindowDimensions();
  const colorScheme = useColorScheme();
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
    if (type === '4') {
      content.groupJoin?.name;
      return (
        <TextLight>
          <TextLight style={{ color: Colors[colorScheme ?? 'light'].greyDark }}>a rejoint le groupe </TextLight>{' '}
          <TextMedium>{content.groupJoin?.name}</TextMedium>{' '}
        </TextLight>
      );
    }
  };

  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: verticalScale(10),
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
        <Image
          source={{ uri: user.avatar }}
          style={{
            width: horizontalScale(SMALL_PIC_USER + 15),
            aspectRatio: 1,
            borderRadius: 90,
            alignSelf: 'flex-start',
          }}
          transition={100}
        />
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
                  {user.username.length > 20 ? `${user.username.slice(0, 20)}...` : user.username}
                </TextLight>{' '}
                {typePost(type)}
              </TextLight>
            </View>
          </View>
          <TextRegular
            style={{
              color: Colors[colorScheme ?? 'light'].greyDark,
              fontSize: moderateScale(14),
            }}
          >
            {formatPostDate(date)}
          </TextRegular>
        </View>
      </View>
      <TouchableOpacity style={{ marginLeft: horizontalScale(25) }}>
        <Ionicons name="ellipsis-vertical" size={24} color={Colors[colorScheme ?? 'light'].greyDark} />
      </TouchableOpacity>
    </View>
  );
};
export default PostHeader;
