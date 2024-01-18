import React from 'react';

import { View } from '../../components/Themed';
import { useHistoriqueStore } from '../../managementState/server/activityUser/Historique';
import PostIndexHistorique from '../../components/post/PostIndexHistorique';

const MyActivity = () => {
  const { getHistorique, listHistorique, loadingHistorique } = useHistoriqueStore((state) => state);
  const dataHistorique = Array.from(listHistorique.values());
  return (
    <View style={{ flex: 1 }}>
      <PostIndexHistorique
        //@ts-ignore
        DATA={dataHistorique}
        loadData={getHistorique}
        loadindGetData={loadingHistorique}
      />
    </View>
  );
};

export default MyActivity;
