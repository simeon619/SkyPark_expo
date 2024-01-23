import React from 'react';
import { View } from '../../components/Themed';
import PostIndex from '../../components/post/PostIndex';
import { useThreadPostStore } from '../../managementState/server/post/postThread';
import useToggleStore from '../../managementState/client/preference';

const Neighbor = () => {
	const {
		getListPost,
		listPostNeighbors,
		loadindGetDataNeighbors,
		listPostBuilding,
		loadindGetDataBuilding,
	} = useThreadPostStore((state) => state);
	const nameLocation = useToggleStore((state) => state.name);

	return (
		<View style={{ flex: 1 }}>
			<PostIndex
				key={nameLocation === 'Neighbor' ? 'Thread' : 'threadBuilding'}
				DATA={nameLocation === 'Neighbor' ? listPostNeighbors : listPostBuilding}
				//@ts-ignore
				loadData={getListPost}
				loadindGetData={
					nameLocation === 'Neighbor' ? loadindGetDataNeighbors : loadindGetDataBuilding
				}
				typePost={nameLocation === 'Neighbor' ? 'Thread' : 'threadBuilding'}
			/>
		</View>
	);
};

export default Neighbor;
