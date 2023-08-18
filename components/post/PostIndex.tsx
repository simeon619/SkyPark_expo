import React, { memo, useCallback, useEffect } from 'react';
import { ActivityIndicator, useWindowDimensions } from 'react-native';
import { moderateScale } from '../../Utilis/metrics';
import { PostType } from '../../types/PostType';
import { TextMedium } from '../StyledText';
import { View } from '../Themed';
import PostMedia from './PostMedia';
import PostText from './PostText';
import { ArrayData } from '../../lib/SQueryClient';
import { PostInterface } from '../../managementState/server/Descriptions';
import { useQuarterPostStore } from '../../managementState/server/post/postQuarter';
import { FlatList, RefreshControl } from 'react-native-gesture-handler';

const PostIndex = ({ DATA, loadData }: { DATA: ArrayData<PostInterface>; loadData: (page: number) => void }) => {
  const { loadindGetData } = useQuarterPostStore((state) => state);

  useEffect(() => {
    fetchData();
  }, []);

  // Function to fetch data from your API
  const fetchData = async () => {
    try {
      loadData(1);
    } catch (error) {
      console.error(error);
    } finally {
    }
  };

  const handleRefresh = () => {
    loadData(1);
  };

  const handleLoadMore = () => {
    console.log('load more', DATA.hasNextPage);

    if (DATA.hasNextPage) {
      loadData(DATA.nextPage || 1);
    }
  };

  const ListFooterComponent = useCallback(() => {
    return (
      <>
        <View style={{ height: height * 0.05 }} />
        {loadindGetData ? <ActivityIndicator size="large" /> : null}
        <View style={{ height: height * 0.05 }} />
      </>
    );
  }, []);

  const { height } = useWindowDimensions();

  return (
    <FlatList
      data={DATA.items}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      refreshControl={<RefreshControl refreshing={loadindGetData} onRefresh={handleRefresh} />}
      scrollEventThrottle={500}
      onEndReached={handleLoadMore}
      maxToRenderPerBatch={5}
      removeClippedSubviews={true}
      onEndReachedThreshold={0.6}
      ListFooterComponent={ListFooterComponent}
    />
  );
};

const renderItem = ({ item }: { item: PostInterface }) => {
  switch (item.type) {
    case PostType.TEXT:
      return <PostText dataPost={item} />;
    case PostType.T_MEDIA:
      return <PostMedia dataPost={item} />;
    // case PostType.SURVEY:
    //   return <PostSurvey dataPost={item} />;
    // case PostType.GROUP_JOIN:
    //   return <PostJoined dataPost={item} />;
    default:
      return <TextMedium style={{ fontSize: moderateScale(40) }}>pas encore gerer</TextMedium>;
  }
};

const keyExtractor = (item: PostInterface, index: number) => index.toString();
export default memo(PostIndex);
