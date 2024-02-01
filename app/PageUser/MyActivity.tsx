import React from 'react';

import { View } from '../../components/Themed';
import { useHistoriqueStore } from '../../managementState/server/activityUser/Historique';
import PostIndexHistorique from '../../components/post/PostIndexHistorique';

const MyActivity = () => {
	const { getHistorique, listHistorique, loadingHistorique } = useHistoriqueStore((state) => state);
	// const dataHistorique = Array.from(Object.keys(listHistorique).map((key) => listHistorique[key]));
	return (
		<View style={{ flex: 1 }}>
			<PostIndexHistorique DATA={listHistorique} loadData={getHistorique} loadindGetData={false} />
		</View>
	);
};

export default MyActivity;
