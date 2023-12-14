import { useNavigation } from '@react-navigation/native';
import { Image } from 'expo-image';
import React, { useCallback, useEffect, useState } from 'react';
import { TouchableOpacity, useColorScheme } from 'react-native';
import { iconsStat } from '../../Utilis/data';
import { useDebouncedApi } from '../../Utilis/hook/debounce';
import { horizontalScale, moderateScale, verticalScale } from '../../Utilis/metrics';
import Colors from '../../constants/Colors';
import { SQuery } from '../../managementState';
import useToggleStore from '../../managementState/client/preference';
import {
  AccountInterface,
  MessageInterface,
  PostInterface,
  ProfileInterface,
} from '../../managementState/server/Descriptions';
import { Text, View } from '../Themed';

const PostFooter = ({
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
  const [statPos, setStatPos] = useState(data.statPost);
  const colorScheme = useColorScheme();
  const navigation = useNavigation();
  const { primaryColour } = useToggleStore((state) => state);

  useEffect(() => {
    const refreshState = async () => {
      let dataStatPost = await SQuery.service('post', 'statPost', {
        postId: data._id,
        like: !statPos['isLiked'],
      });

      setStatPos(() => {
        return {
          comments: dataStatPost.response?.comments || 0,
          likes: dataStatPost.response?.likes || 0,
          isLiked: dataStatPost.response?.isLiked || false,
          shares: dataStatPost.response?.shares || 0,
          totalCommentsCount: dataStatPost.response?.totalCommentsCount || 0,
        };
      });
    };
    refreshState();
  }, []);
  const sendLike = async () => {
    try {
      let dataStatPost = await SQuery.service('post', 'statPost', {
        postId: data._id,
        like: !statPos['isLiked'],
      });

      setStatPos(() => {
        return {
          comments: dataStatPost.response?.comments || 0,
          likes: dataStatPost.response?.likes || 0,
          isLiked: dataStatPost.response?.isLiked || false,
          shares: dataStatPost.response?.shares || 0,
          totalCommentsCount: dataStatPost.response?.totalCommentsCount || 0,
        };
      });
    } catch (error) {
      console.error(error, 'like');
    }
  };
  const [_value, func] = useDebouncedApi(sendLike, 1000);

  const toogleLike = useCallback((statPos: typeof data.statPost) => {
    setStatPos(() => {
      return {
        ...statPos,
        likes: statPos['isLiked'] ? statPos['likes'] - 1 : statPos['likes'] + 1,
        isLiked: !statPos['isLiked'],
      };
    });
  }, []);

  useEffect(() => {
    if (data.statPost) {
      setStatPos(data.statPost);
    }
  }, [data.statPost]);

  const actionComment = (actionName: string) => {
    switch (actionName) {
      case 'comments': {
        const dataPost = JSON.stringify(data);
        const infoUser = JSON.stringify(user);
        const messageUser = JSON.stringify(message);
        //@ts-ignore
        navigation.navigate(`DetailPost`, { dataPost, infoUser, messageUser, id: data._id, commentable: true });
      }
      case 'shares':
        return 'Share';
      case 'likes': {
        const setLike = async () => {
          toogleLike(statPos);
          func();
        };
        setLike();
      }
    }
  };
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomColor: Colors[colorScheme ?? 'light'].grey,
        borderBottomWidth: 1,
        borderTopColor: Colors[colorScheme ?? 'light'].grey,
        borderTopWidth: 1,
        paddingVertical: verticalScale(7),
        paddingHorizontal: horizontalScale(10),
        marginTop: verticalScale(5),
      }}
    >
      {iconsStat.map((icon: any, index) => {
        const { url, name }: { url: string; name: 'shares' | 'comments' | 'likes' } = icon;
        return (
          <TouchableOpacity
            onPress={() => {
              actionComment(name);
            }}
            key={index}
            style={{ flexDirection: 'row', columnGap: horizontalScale(5), alignItems: 'center' }}
          >
            <Image
              source={url}
              style={{
                width: 20,
                height: 20,
                tintColor: statPos['isLiked'] && name == 'likes' ? primaryColour : 'black',
              }}
            />
            <Text
              style={{
                fontSize: moderateScale(16),
                backgroundColor: Colors[colorScheme ?? 'light'].grey,
                alignSelf: 'center',
                fontWeight: '200',
                borderRadius: moderateScale(99),
                paddingHorizontal: moderateScale(7),
                color: statPos['isLiked'] && name == 'likes' ? primaryColour : 'black',
              }}
            >
              {statPos[name]}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
export default PostFooter;
