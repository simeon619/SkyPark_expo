import React from 'react';
import ForumIndex from '../../../components/post/ForumIndex';
import { useListResponseForum } from '../../../managementState/server/forum';

const Response = () => {
	const { getList, listForum, hasMore, page, loading } = useListResponseForum();
	return (
		// <></>
		<ForumIndex
			getList={getList}
			// @ts-ignore
			listForum={listForum}
			hasMore={hasMore}
			pageNext={page}
			loading={loading}
		/>
	);
};

export default Response;
