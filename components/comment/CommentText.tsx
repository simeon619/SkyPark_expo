import React from 'react';

import { useInfoUserPost, useMessagePost } from '../../Utilis/hook/getInfoPostUser';
import { PostInterface } from '../../managementState/server/Descriptions';
import TextComponent from '../utilis/TextComponent';
import CommentFooter from './CommentFooter';
import CommentHeader from './CommentHeader';

const CommentText = ({ dataPost }: { dataPost: PostInterface }) => {
  const message = useMessagePost({ dataPost });
  const infoUser = useInfoUserPost({ accountId: message?.account });

  return (
    <>
      <CommentHeader data={dataPost} user={infoUser} message={message} />
      <TextComponent data={dataPost} message={message} user={infoUser} />
      <CommentFooter data={dataPost} user={infoUser} message={message} />
    </>
  );
};
export default CommentText;
