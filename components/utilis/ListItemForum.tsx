import { AntDesign } from '@expo/vector-icons';
import React from 'react';
import { formatPostDate } from '../../Utilis/date';
import { horizontalScale, moderateScale, shadow } from '../../Utilis/metrics';
import { TextLight } from '../StyledText';
import { View } from '../Themed';
import { PostForumType } from '../../managementState/server/forum';
import { Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ItemForum = ({ item }: { item: PostForumType }) => {
  const navigation = useNavigation();
  return (
    <Pressable
      onPress={() => {
        // @ts-ignore
        navigation.navigate('PageForum', { forumData: item });
      }}
    >
      <View
        style={{
          ...shadow(5),
          marginVertical: 10,
          marginHorizontal: horizontalScale(5),
          paddingHorizontal: horizontalScale(15),
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <View style={{ flex: 1, padding: moderateScale(2) }}>
            <TextLight numberOfLines={1}>{item.theme}</TextLight>
          </View>
          <AntDesign name="delete" size={22} color="black" style={{ marginRight: horizontalScale(10) }} />
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View>
            <TextLight style={{ color: '#aaae' }}>il ya {formatPostDate(+item.message.__createdAt)}</TextLight>
          </View>
          <View>
            <TextLight style={{ color: '#aaae' }}>
              {item.comments.length} {item.comments.length === 1 ? 'response' : 'responses'}
            </TextLight>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

export default ItemForum;
