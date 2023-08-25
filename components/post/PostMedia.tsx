import React, { memo } from 'react';
import { View } from '../Themed';
import MediaComponent from '../utilis/MediaComponent';
import TextComponent from '../utilis/TextComponent';
import PostHeader from './PostHeader';
import { PostInterface } from '../../managementState/server/Descriptions';
import { useInfoUserPost, useMessagePost } from '../../Utilis/hook/getInfoPostUser';
import PostFooter from './PostFooter';

const PostMedia = ({ dataPost }: { dataPost: PostInterface }) => {
  const message = useMessagePost({ dataPost });
  const infoUser = useInfoUserPost({ accountId: message?.account });

  return (
    <View style={{ flex: 1 }}>
      <PostHeader data={dataPost} user={infoUser} message={message} />
      <TextComponent message={message} data={dataPost} user={infoUser} />
      <MediaComponent media={message?.files} caption={message?.text} />
      <PostFooter stat={dataPost.statPost} />
    </View>
  );
};
export default memo(PostMedia);
