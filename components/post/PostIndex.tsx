import { FlashList } from '@shopify/flash-list';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, useWindowDimensions } from 'react-native';
import { moderateScale } from '../../Utilis/metrics';
import { PostSchema, PostType } from '../../types/PostType';
import { TextMedium } from '../StyledText';
import { View } from '../Themed';
import PostJoined from './PostJoined';
import PostMedia from './PostMedia';
import PostSurvey from './PostSurvey';
import PostText from './PostText';

const PostIndex = ({ DATA }: { DATA: PostSchema[] }) => {
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  useEffect(() => {
    fetchData();
  }, []);

  // Function to fetch data from your API
  const fetchData = async () => {
    try {
      setIsLoading(true);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setPage(1);
    fetchData();
  };

  const handleLoadMore = () => {
    if (!isLoading) {
      setPage((prevPage) => prevPage + 1);
      fetchData();
    }
  };
  const { height, width } = useWindowDimensions();

  const renderItem = useCallback(({ item }: { item: PostSchema }) => {
    switch (item.type) {
      case PostType.TEXT:
        return <PostText dataPost={item} />;
      case PostType.T_MEDIA:
        return <PostMedia dataPost={item} />;
      case PostType.SURVEY:
        return <PostSurvey dataPost={item} />;
      case PostType.GROUP_JOIN:
        return <PostJoined dataPost={item} />;
      default:
        return <TextMedium style={{ fontSize: moderateScale(40) }}>ERROR</TextMedium>;
    }
  }, []);

  return (
    <FlashList
      onLoad={(time) => {
        console.log(time);
      }}
      data={DATA}
      renderItem={renderItem}
      estimatedItemSize={height * 0.3}
      keyExtractor={(item, index) => item.id.toString()}
      onRefresh={handleRefresh}
      scrollEventThrottle={500}
      refreshing={isRefreshing}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.6}
      ListFooterComponent={() => (
        <>
          <View style={{ height: height * 0.05 }} />
          {isLoading ? <ActivityIndicator size="large" /> : null}
          <View style={{ height: height * 0.05 }} />
        </>
      )}
      getItemType={(item) => {
        return item.type;
      }}
    />
  );
};
export default PostIndex;
