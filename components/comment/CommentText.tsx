import React from 'react';

import TextComponent from '../utilis/TextComponent';
import { useMessagePost, useInfoUserPost } from '../../Utilis/hook/getInfoPostUser';
import { PostInterface } from '../../managementState/server/Descriptions';
import CommentFooter from './CommentFooter';
import CommentHeader from './CommentHeader';

const CommentText = ({ dataPost }: { dataPost: PostInterface }) => {
  const message = useMessagePost({ dataPost });
  const infoUser = useInfoUserPost({ accountId: message?.account });

  return (
    <>
      <CommentHeader data={dataPost} user={infoUser} message={message} />
      <TextComponent data={dataPost} message={message} user={infoUser} />
      <CommentFooter stat={dataPost.statPost} />
    </>
  );
};
export default CommentText;
