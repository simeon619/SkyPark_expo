import React from 'react';

import { View } from '../../components/Themed';
import PostIndex from '../../components/post/PostIndex';

import { useQuarterPostStore } from '../../managementState/server/post/postQuarter';
const Neighbor = () => {
  const { getListPost, listPost, loadindGetData } = useQuarterPostStore((state) => state);
  return (
    <View style={{ flex: 1 }}>
      <PostIndex DATA={listPost} loadData={getListPost} loadindGetData={loadindGetData} />
    </View>
  );
};

export default Neighbor;
