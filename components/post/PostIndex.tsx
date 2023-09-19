import React, { useCallback, useEffect } from 'react';
import { ActivityIndicator, FlatList, useWindowDimensions } from 'react-native';
import { moderateScale } from '../../Utilis/metrics';
import { ArrayData } from '../../lib/SQueryClient';
import { PostInterface } from '../../managementState/server/Descriptions';
import { PostType } from '../../types/PostType';
import { TextMedium } from '../StyledText';
import { View } from '../Themed';
import PostMedia from './PostMedia';
import PostText from './PostText';
import { RefreshControl } from 'react-native';
import PostSurvey from './PostSurvey';

const PostIndex = ({
  DATA,
  loadData,
  loadindGetData,
}: {
  DATA: ArrayData<PostInterface>;
  loadData: (page: number) => void;
  loadindGetData: boolean;
}) => {
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      loadData(1);
    } catch (error) {
      console.error(error);
    } finally {
    }
  };

  const handleLoadMore = () => {
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
      refreshControl={<RefreshControl refreshing={loadindGetData} onRefresh={fetchData} />}
      scrollEventThrottle={500}
      onEndReached={handleLoadMore}
      // maxToRenderPerBatch={5}
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
    case PostType.SURVEY: {
      return <PostSurvey dataPost={item} />;
    }
    // case PostType.GROUP_JOIN:
    //   return <PostJoined dataPost={item} />;
    default:
      return <TextMedium style={{ fontSize: moderateScale(25), textAlign: 'center' }}>pas encore gerer</TextMedium>;
  }
};

const keyExtractor = (item: PostInterface, index: number) => index.toString();
export default PostIndex;
