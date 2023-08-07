import React from 'react';

import { View } from '../../components/Themed';
import PostIndex from '../../components/post/PostIndex';
import Post from '../../post.json';
const Neighbor = () => {

  return (
    <View style={{ flex: 1 }}>
      <PostIndex DATA={Post} />
    </View>
  );
};

export default React.memo(Neighbor);
