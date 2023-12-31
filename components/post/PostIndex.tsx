import React, { Suspense, useCallback, useEffect } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, useWindowDimensions } from 'react-native';
import { moderateScale } from '../../Utilis/metrics';
import { ArrayData } from '../../lib/SQueryClient';
import { PostInterface } from '../../managementState/server/Descriptions';
import { PostType } from '../../types/PostType';
import { TextMedium } from '../StyledText';
import { View } from '../Themed';
import PostMedia from './PostMedia';

import { TypePostSchema } from '../../managementState/server/post/postThread';
import PostSurvey from './PostSurvey';
import PostText from './PostText';

const PostIndex = ({
  DATA,
  loadData,
  loadindGetData,
  typePost,
}: {
  DATA: ArrayData<PostInterface>;
  loadData: (page: number, typePost: TypePostSchema) => Promise<any>;
  loadindGetData: boolean;
  typePost: TypePostSchema;
}) => {
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      await loadData(1, typePost);
    } catch (error) {
      console.error(error);
    } finally {
    }
  };

  const handleLoadMore = async () => {
    if (DATA?.hasNextPage) {
      await loadData(DATA?.nextPage || 1, typePost);
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
      data={DATA?.items}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      refreshControl={<RefreshControl refreshing={loadindGetData} onRefresh={() => fetchData()} />}
      scrollEventThrottle={500}
      onEndReached={() => handleLoadMore()}
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
      return (
        <Suspense
          fallback={<TextMedium style={{ fontSize: moderateScale(18), textAlign: 'center' }}>Loading</TextMedium>}
        >
          <PostMedia dataPost={item} />
        </Suspense>
      );

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
