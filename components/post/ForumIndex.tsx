import React, { useEffect } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';
import { ForumType, PostForumType } from '../../managementState/server/forum';
import ItemForum from '../utilis/ListItemForum';

const ForumIndex = ({
  getList,
  listForum,
  hasMore,
  pageNext,
  loading,
}: {
  getList: ({ page }: { page: number }) => Promise<void>;
  listForum: Map<string, PostForumType>;
  hasMore: boolean;
  pageNext: number;
  loading: boolean;
}) => {
  //   const { getList, listAllForum, hasMoreAll, pageAll, loadingAll } = useListAllForum();
  useEffect(() => {
    fetchData(1);
  }, []);

  const mapToArray = Array.from(listForum.values());

  const handleLoadMore = async () => {
    if (hasMore) {
      await fetchData(pageNext);
    }
  };
  const fetchData = async (page: number) => {
    try {
      getList({ page });
    } catch (error) {
      console.error(error);
    } finally {
    }
  };

  return (
    <View>
      <FlatList
        data={mapToArray}
        keyExtractor={keyExtractor}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={() => fetchData(1)} />}
        onEndReached={() => handleLoadMore()}
        renderItem={(item) => <ItemForum item={item.item} />}
      />
    </View>
  );
};

export default ForumIndex;
const keyExtractor = (_item: PostForumType, index: number) => index.toString();
