import React from 'react';
import { View } from 'react-native';
import { PostSchema } from '../../types/PostType';
import MediaComponent from '../utilis/MediaComponent';
import SurveyComponent from '../utilis/SurveyComponent';
import PostFooter from './PostFooter';
import PostHeader from './PostHeader';

const PostSurvey = ({ dataPost }: { dataPost: PostSchema }) => {
  return (
    <View style={{ flex: 1 }}>
      {/* <PostHeader date={dataPost.createdAt} user={dataPost.user} type={dataPost.type} content={dataPost.content} />
      <SurveyComponent dataSurvey={dataPost.content.survey} question={dataPost.content.text} />
      <MediaComponent media={dataPost.content.media} />
      <PostFooter stat={dataPost.statPost} /> */}
    </View>
  );
};

export default PostSurvey;
