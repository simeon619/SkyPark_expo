import React from 'react';
import ForumIndex from '../../../components/post/ForumIndex';
import { useMyForumList } from '../../../managementState/server/forum';

const MyTheme = () => {
	const { getList, listForum, hasMore, page, loading } = useMyForumList();
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

export default MyTheme;
