import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect } from 'react';
import { TouchableOpacity, useColorScheme } from 'react-native';
import { useDebouncedApi } from '../../Utilis/hook/debounce';
import { horizontalScale, moderateScale } from '../../Utilis/metrics';
import Colors from '../../constants/Colors';
import { SQuery } from '../../managementState';
import useToggleStore from '../../managementState/client/preference';
import {
  AccountInterface,
  MessageInterface,
  PostInterface,
  ProfileInterface,
} from '../../managementState/server/Descriptions';
import { TextLight } from '../StyledText';
import { View } from '../Themed';
const CommentFooter = ({
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
  const { primaryColour } = useToggleStore((state) => state);
  const [statPos, setStatPos] = React.useState(data.statPost);

  // Remove the listener when you are done
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
  }, [navigation.isFocused()]);

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
  const [_value, func] = useDebouncedApi(sendLike, 2000);

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
    setStatPos(data.statPost);
  }, [data.statPost]);

  const action = {
    comments: 'comments',
    likes: 'likes',
  };

  const actionComment = (actionName: string) => {
    switch (actionName) {
      case 'comments': {
        const dataPost = JSON.stringify(data);
        const infoUser = JSON.stringify(user);
        const messageUser = JSON.stringify(message);
        //@ts-ignore
        navigation.push(`DetailPost`, { dataPost, infoUser, messageUser, id: data._id, commentable: true });
      }
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
        columnGap: horizontalScale(25),
        borderBottomColor: Colors[colorScheme ?? 'light'].grey,
        borderBottomWidth: 1,
        paddingLeft: horizontalScale(50),
      }}
    >
      {Object.values(action).map((icon, index) => {
        const name = icon as string as 'comments' | 'likes';
        return (
          <TouchableOpacity
            onPress={() => actionComment(name)}
            key={index}
            style={{ flexDirection: 'row', columnGap: horizontalScale(5) }}
          >
            <TextLight
              style={{
                fontSize: moderateScale(16),
                alignSelf: 'center',
                borderRadius: moderateScale(99),
                paddingHorizontal: moderateScale(7),
                color: statPos['isLiked'] && name == 'likes' ? primaryColour : 'black',
              }}
            >
              {statPos[name] <= 2
                ? statPos[name] + ' ' + name.substring(0, name.length - 1)
                : statPos[name] + ' ' + name}
            </TextLight>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
export default CommentFooter;
