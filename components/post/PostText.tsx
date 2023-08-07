import React from 'react';
import { PostSchema } from '../../types/PostType';
import TextComponent from '../utilis/TextComponent';
import PostFooter from './PostFooter';
import PostHeader from './PostHeader';

const PostText = ({ dataPost }: { dataPost: PostSchema }) => {
  return (
    <>
      <PostHeader date={dataPost.createdAt} user={dataPost.user} type={dataPost.type} />
      <TextComponent text={dataPost.content.text} />
      <PostFooter stat={dataPost.statPost} />
    </>
  );
};
export default PostText;
