import React from 'react';
import { useListPopularLikes } from '../../../managementState/server/forum';
import ForumIndex from '../../../components/post/ForumIndex';

const Likes = () => {
  const { getList, hasMore, listForum, loading, page } = useListPopularLikes();

  return <ForumIndex getList={getList} listForum={listForum} hasMore={hasMore} pageNext={page} loading={loading} />;
};

export default Likes;
