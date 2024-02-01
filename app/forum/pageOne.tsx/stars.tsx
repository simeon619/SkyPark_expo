import React from 'react';
import { useListFavorites } from '../../../managementState/server/forum';
import ForumIndex from '../../../components/post/ForumIndex';

const Stars = () => {
	const { getList, listForum, hasMore, page, loading } = useListFavorites();

	return (
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

export default Stars;
