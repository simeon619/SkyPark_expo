import React from 'react';
import { useListAllForum } from '../../../managementState/server/forum';
import ForumIndex from '../../../components/post/ForumIndex';

const All = () => {
  const { getList, listAllForum, hasMoreAll, pageAll, loadingAll } = useListAllForum();

  return (
    <ForumIndex
      getList={getList}
      // @ts-ignore
      listForum={listAllForum}
      hasMore={hasMoreAll}
      pageNext={pageAll}
      loading={loadingAll}
    />
  );
};

export default All;
