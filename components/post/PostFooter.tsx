import { useNavigation } from '@react-navigation/native';
import { Image } from 'expo-image';
import React from 'react';
import { TouchableOpacity, useColorScheme } from 'react-native';
import { iconsStat } from '../../Utilis/data';
import { useDebouncedApi } from '../../Utilis/hook/debounce';
import { horizontalScale, moderateScale, verticalScale } from '../../Utilis/metrics';
import Colors from '../../constants/Colors';
import useToggleStore from '../../managementState/client/preference';
import {
  AccountInterface,
  MessageInterface,
  PostInterface,
  ProfileInterface,
} from '../../managementState/server/Descriptions';
import { Text, View } from '../Themed';
import { useStatPost } from '../../Utilis/hook/statPost';

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
  const colorScheme = useColorScheme();
  const navigation = useNavigation();
  const { primaryColour } = useToggleStore((state) => state);

  const { sendLike, statPos, toogleLike } = useStatPost({ data: data.statPost, postId: data._id });
  const [_value, func] = useDebouncedApi(sendLike, 1000);

  const actionComment = (actionName: string) => {
    switch (actionName) {
      case 'comments': {
        const dataPost = JSON.stringify(data);
        const infoUser = JSON.stringify(user);
        const messageUser = JSON.stringify(message);
        //@ts-ignore
        navigation.navigate(`DetailPost`, { dataPost, infoUser, messageUser, id: data._id, commentable: true });
        return;
      }
      case 'shares': {
        //@ts-ignore
        navigation.navigate(`SharePost`, { postId: data._id });
        // magicModal.show(SharePost, {
        //   useNativeDriver: true,
        //   animationIn: 'slideInUp',
        //   animationOut: 'slideOutDown',
        //   animationInTiming: 600,
        //   animationOutTiming: 600,
        //   backdropTransitionOutTiming: 500,
        //   backdropOpacity: 0,
        //   useNativeDriverForBackdrop: true,
        // });
        return;
      }
      case 'likes': {
        const setLike = async () => {
          toogleLike(statPos);
          func();
        };
        setLike();
        return;
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
