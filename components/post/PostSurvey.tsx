import React, { useEffect } from 'react';
import { useInfoUserPost, useMessagePost } from '../../Utilis/hook/getInfoPostUser';
import { PostInterface } from '../../managementState/server/Descriptions';
import PostHeader from './PostHeader';
import SurveyComponent from '../utilis/SurveyComponent';
import { useSurveyStore } from '../../managementState/server/post/surveyStore';
import MediaComponent from '../utilis/MediaComponent';
import PostFooter from './PostFooter';

const PostSurvey = ({ dataPost }: { dataPost: PostInterface }) => {
  const message = useMessagePost({ dataPost });
  const infoUser = useInfoUserPost({ accountId: message?.account });
  const { listSurvey, setListSurvey } = useSurveyStore((state) => state);

  useEffect(() => {
    if (dataPost.survey) {
      setListSurvey(dataPost.survey);
    }
  }, []);

  return (
    <>
      <PostHeader data={dataPost} user={infoUser} message={message} />
      <SurveyComponent dataSurvey={listSurvey.get(dataPost._id)} question={message?.text} postId={dataPost._id} />
      <MediaComponent media={message?.files} caption={message?.text} />
      <PostFooter message={message} data={dataPost} user={infoUser} />
    </>
  );
};

export default PostSurvey;
