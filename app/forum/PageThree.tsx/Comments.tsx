import React from 'react';
import ForumIndex from '../../../components/post/ForumIndex';
import { useListPopularComments } from '../../../managementState/server/forum';

const Comments = () => {
  const { getList, hasMore, listForum, loading, page } = useListPopularComments();

  return <ForumIndex getList={getList} listForum={listForum} hasMore={hasMore} pageNext={page} loading={loading} />;
};

export default Comments;
