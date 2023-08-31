import React from 'react';
import { useInfoUserPost, useMessagePost } from '../../Utilis/hook/getInfoPostUser';
import { PostInterface } from '../../managementState/server/Descriptions';
import { View } from '../Themed';
import MediaComponent from '../utilis/MediaComponent';
import TextComponent from '../utilis/TextComponent';
import PostFooter from './PostFooter';
import PostHeader from './PostHeader';

const PostMedia = ({ dataPost }: { dataPost: PostInterface }) => {
  const message = useMessagePost({ dataPost });
  const infoUser = useInfoUserPost({ accountId: message?.account });

  return (
    <View style={{ flex: 1 }}>
      <PostHeader data={dataPost} user={infoUser} message={message} />
      <TextComponent message={message} data={dataPost} user={infoUser} />
      <MediaComponent media={message?.files} caption={message?.text} />
      <PostFooter message={message} data={dataPost} user={infoUser} />
    </View>
  );
};
export default PostMedia;
