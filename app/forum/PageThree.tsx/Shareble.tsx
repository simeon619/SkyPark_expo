import React from 'react';
import { useListPopularShared } from '../../../managementState/server/forum';
import ForumIndex from '../../../components/post/ForumIndex';

const Shareble = () => {
  const { getList, hasMore, listForum, loading, page } = useListPopularShared();

  return <ForumIndex getList={getList} listForum={listForum} hasMore={hasMore} pageNext={page} loading={loading} />;
};

export default Shareble;
