import React, { useCallback, useEffect } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, useWindowDimensions } from 'react-native';
import { moderateScale } from '../../Utilis/metrics';
import { PostType } from '../../types/PostType';
import { TextMedium } from '../StyledText';
import { View } from '../Themed';
import PostMedia from './PostMedia';
import PostSurvey from './PostSurvey';
import PostText from './PostText';
import { HistoriqueType } from '../../managementState/server/activityUser/Historique';
import ImageProfile from '../utilis/simpleComponent/ImageProfile';
import { LARGE_PIC_USER } from '../../constants/Value';
import { ItemActivity } from '../utilis/ItemsActivity';
import { useNavigation } from '@react-navigation/native';

const PostIndexHistorique = ({
  DATA,
  loadData,
  loadindGetData,
}: {
  DATA: HistoriqueType;
  loadData: () => void;
  loadindGetData: boolean;
}) => {
  const navigation = useNavigation();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      loadData();
    } catch (error) {
      console.error(error);
    } finally {
    }
  };
  const ListFooterComponent = useCallback(() => {
    return (
      <>
        <View style={{ height: height * 0.05 }} />
        {loadindGetData ? <ActivityIndicator size="small" /> : null}
        <View style={{ height: height * 0.05 }} />
      </>
    );
  }, []);

  const { height } = useWindowDimensions();
  return (
    <FlatList
      data={DATA}
      renderItem={({ item }) => renderItem({ item, navigation })}
      keyExtractor={keyExtractor}
      refreshControl={<RefreshControl refreshing={loadindGetData} onRefresh={() => fetchData()} />}
      scrollEventThrottle={500}
      showsVerticalScrollIndicator={false}
      removeClippedSubviews={true}
      onEndReachedThreshold={0.6}
      ListFooterComponent={ListFooterComponent}
    />
  );
};

const renderItem = ({ item, navigation }: { item: HistoriqueType[0]; navigation: any }) => {
  if (item.mode === 'listen') {
    return (
      <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <TextMedium>
          Vous avez {item.value === 'true' ? 'rejoint' : 'quitte'} le groupe {item.activity.name}
        </TextMedium>
        <ItemActivity item={item.activity} navigation={navigation} />
      </View>
    );
  } else {
    switch (item.post.type) {
      case PostType.TEXT:
        return (
          <View>
            <TextMedium>Vous avez {item.mode} ce post</TextMedium>
            <PostText dataPost={item.post} />
          </View>
        );
      case PostType.T_MEDIA:
        return (
          <View>
            <TextMedium>Vous avez {item.mode} ce post</TextMedium>
            <PostMedia dataPost={item.post} />
          </View>
        );
      case PostType.SURVEY: {
        return <PostSurvey dataPost={item.post} />;
      }
      // case PostType.GROUP_JOIN:
      //   return <PostJoined dataPost={item} />;
      default:
        return <TextMedium style={{ fontSize: moderateScale(25), textAlign: 'center' }}>pas encore gerer</TextMedium>;
    }
  }
};

const keyExtractor = (_item: HistoriqueType[0], index: number) => index.toString();
export default PostIndexHistorique;
