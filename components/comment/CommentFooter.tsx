import { useNavigation } from '@react-navigation/native';
import { Image } from 'expo-image';
import React from 'react';
import { useColorScheme } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { iconsStat } from '../../Utilis/data';
import { horizontalScale, moderateScale, verticalScale } from '../../Utilis/metrics';
import Colors from '../../constants/Colors';
import {
  AccountInterface,
  MessageInterface,
  PostInterface,
  ProfileInterface,
} from '../../managementState/server/Descriptions';
import { Text, View } from '../Themed';

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

  const actionComment = (actionName: string) => {
    switch (actionName) {
      case 'comments': {
        const dataPost = JSON.stringify(data);
        const infoUser = JSON.stringify(user);
        const messageUser = JSON.stringify(message);

        //@ts-ignore

        navigation.push(`DetailPost`, { dataPost, infoUser, messageUser, id: data._id, commentable: true });
      }
      case 'shares':
        return 'Share';
      case 'likes':
        return 'Like';
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
            onPress={() => actionComment(name)}
            key={index}
            style={{ flexDirection: 'row', columnGap: horizontalScale(5), alignItems: 'center' }}
          >
            <Image source={url} style={{ width: 20, height: 20 }} />
            <Text
              style={{
                fontSize: moderateScale(16),
                backgroundColor: Colors[colorScheme ?? 'light'].grey,
                alignSelf: 'center',
                fontWeight: '200',
                borderRadius: moderateScale(99),
                paddingHorizontal: moderateScale(7),
              }}
            >
              {data.statPost[name]}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
export default CommentFooter;
