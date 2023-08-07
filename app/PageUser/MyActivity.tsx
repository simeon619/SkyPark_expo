import React from 'react';

import PostIndex from '../../components/post/PostIndex';

import { View } from '../../components/Themed';
import UserPost from '../../userPost.json';

const MyActivity = () => {
  return (
    <View style={{ flex: 1 }}>
      <PostIndex DATA={UserPost} />
    </View>
  );
};

export default MyActivity;
