import React from 'react';
import { PostSchema } from '../../types/PostType';
import { View } from '../Themed';
import JoinedGroupComponent from '../utilis/JoinedGroupComponent';
import PostFooter from './PostFooter';
import PostHeader from './PostHeader';

const PostJoined = ({ dataPost }: { dataPost: PostSchema }) => {
  return (
    <View style={{ flex: 1 }}>
      <PostHeader date={dataPost.createdAt} user={dataPost.user} type={dataPost.type} content={dataPost.content} />
      <JoinedGroupComponent item={dataPost.content.groupJoin} />
      <PostFooter stat={dataPost.statPost} />
    </View>
  );
};

export default PostJoined;
