import React from 'react';
import TextComponent from '../utilis/TextComponent';
import PostHeader from './PostHeader';
import { PostInterface } from '../../managementState/server/Descriptions';
import { useMessagePost, useInfoUserPost } from '../../Utilis/hook/getInfoPostUser';
import PostFooter from './PostFooter';

const PostText = ({ dataPost }: { dataPost: PostInterface }) => {
  const message = useMessagePost({ dataPost });
  const infoUser = useInfoUserPost({ accountId: message?.account });

  return (
    <>
      <PostHeader data={dataPost} user={infoUser} message={message} />
      <TextComponent data={dataPost} message={message} user={infoUser} />
      <PostFooter data={dataPost} message={message} user={infoUser} />
    </>
  );
};
export default PostText;
