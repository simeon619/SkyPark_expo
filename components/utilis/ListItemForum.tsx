import { AntDesign } from '@expo/vector-icons';
import React from 'react';
import { formatPostDate } from '../../Utilis/date';
import { horizontalScale, moderateScale, shadow } from '../../Utilis/metrics';
import { TextLight } from '../StyledText';
import { View } from '../Themed';
import { Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ByAccountResult } from '../../managementState/server/byAccount';

const ItemForum = ({ item }: { item: ByAccountResult }) => {
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
            <TextLight numberOfLines={5}>{item.theme}</TextLight>
          </View>
          <AntDesign name="delete" size={22} color="black" style={{ marginRight: horizontalScale(10) }} />
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View>
            <TextLight style={{ color: '#aaae' }}>il ya {formatPostDate(+item.message.__createdAt)}</TextLight>
          </View>
          <View>
            <TextLight style={{ color: '#aaae' }}>
              {item.statPost.totalCommentsCount} {item.statPost.totalCommentsCount === 1 ? 'response' : 'responses'}
            </TextLight>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

export default ItemForum;
