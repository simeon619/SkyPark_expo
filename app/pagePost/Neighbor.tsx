import React from 'react';

import { View } from '../../components/Themed';
import PostIndex from '../../components/post/PostIndex';

import { useQuarterPostStore } from '../../managementState/server/post/postQuarter';
const Neighbor = () => {
  const { getListPost, listPost } = useQuarterPostStore((state) => state);

  // useEffect(() => {
  //   getListPost(listPost.page || 1);
  // }, []);
  return (
    <View style={{ flex: 1 }}>
      <PostIndex DATA={listPost} loadData={getListPost} />
    </View>
  );
};

export default Neighbor;
