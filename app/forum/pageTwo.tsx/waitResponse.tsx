import React from 'react';
import { useListWaitForum } from '../../../managementState/server/forum';
import ForumIndex from '../../../components/post/ForumIndex';

const WaitResponse = () => {
	const { getList, listAllForum, hasMoreAll, pageAll, loadingAll } = useListWaitForum();

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

export default WaitResponse;
