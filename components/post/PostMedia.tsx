import React, { memo } from 'react';
import { PostSchema } from '../../types/PostType';
import { View } from '../Themed';
import MediaComponent from '../utilis/MediaComponent';
import TextComponent from '../utilis/TextComponent';
import PostFooter from './PostFooter';
import PostHeader from './PostHeader';

const PostMedia = ({ dataPost }: { dataPost: PostSchema }) => {
  return (
    <View style={{ flex: 1 }}>
      <PostHeader date={dataPost.createdAt} user={dataPost.user} type={dataPost.type} content={dataPost.content} />
      <TextComponent text={dataPost.content.text} />
      <MediaComponent media={dataPost.content.media} />
      <PostFooter stat={dataPost.statPost} />
    </View>
  );
};
export default memo(PostMedia);
