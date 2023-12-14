import React from 'react';

import { View } from '../../components/Themed';
import PostIndex from '../../components/post/PostIndex';

import { useThreadPostStore } from '../../managementState/server/post/postThread';
const Neighbor = () => {
  const { getListPost, listPostNeighbors, loadindGetDataNeighbors } = useThreadPostStore((state) => state);
  return (
    <View style={{ flex: 1 }}>
      <PostIndex
        DATA={listPostNeighbors}
        //@ts-ignore
        loadData={getListPost}
        loadindGetData={loadindGetDataNeighbors}
        typePost="Thread"
      />
    </View>
  );
};

export default Neighbor;
