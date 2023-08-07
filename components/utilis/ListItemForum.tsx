import { AntDesign } from '@expo/vector-icons';
import React from 'react';
import { useWindowDimensions } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { formatPostDate } from '../../Utilis/date';
import { horizontalScale, moderateScale, shadow } from '../../Utilis/metrics';
import ItemForum from '../../itemForum.json';
import { ForumItemType } from '../../types/ForumType';
import { TextLight } from '../StyledText';
import { View } from '../Themed';

const ListItemForum = () => {
  const { width } = useWindowDimensions();
  const ItemForumRender = ({ item }: { item: ForumItemType }) => {
    return (
      <View
        style={{
          ...shadow(5),
          marginVertical: 10,
          marginHorizontal: horizontalScale(5),
          paddingHorizontal: horizontalScale(7),
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <View style={{ flex: 1, padding: moderateScale(10) }}>
            <TextLight numberOfLines={1}>{item.content.text}</TextLight>
          </View>
          <AntDesign name="delete" size={22} color="black" style={{ marginRight: horizontalScale(10) }} />
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View>
            <TextLight style={{ color: '#aaae' }}>il ya {formatPostDate(item.createdAt)}</TextLight>
          </View>
          <View>
            <TextLight style={{ color: '#aaae' }}>
              {item.nbrResponse} {item.nbrResponse === 1 ? 'response' : 'responses'}
            </TextLight>
          </View>
        </View>
      </View>
    );
  };
  return (
    <View style={{ flex: 1 }}>
      <FlatList data={ItemForum} renderItem={ItemForumRender} />
    </View>
  );
};

export default ListItemForum;
