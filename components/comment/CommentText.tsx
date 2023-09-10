import React from 'react';

import { useInfoUserPost, useMessagePost } from '../../Utilis/hook/getInfoPostUser';
import { PostInterface } from '../../managementState/server/Descriptions';
import TextComponent from '../utilis/TextComponent';
import CommentFooter from './CommentFooter';
import CommentHeader from './CommentHeader';
import TextComment from './TextComment';

const CommentText = ({ dataPost, postParent }: { dataPost: PostInterface; postParent: string }) => {
  const message = useMessagePost({ dataPost });
  const infoUser = useInfoUserPost({ accountId: message?.account });

  return (
    <>
      <CommentHeader data={dataPost} user={infoUser} message={message} postParent={postParent} />
      <TextComment data={dataPost} message={message} user={infoUser} />
      <CommentFooter data={dataPost} user={infoUser} message={message} />
    </>
  );
};
export default CommentText;
