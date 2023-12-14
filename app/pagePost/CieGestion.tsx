import React from 'react';
import { View } from '../../components/Themed';
import PostIndex from '../../components/post/PostIndex';
import { useThreadPostStore } from '../../managementState/server/post/postThread';

const CieGestion = () => {
  const { getListPost, listPostSupervisor, loadindGetDataSupervisor } = useThreadPostStore((state) => state);
  return (
    <View style={{ flex: 1 }}>
      <PostIndex
        DATA={listPostSupervisor}
        //@ts-ignore
        loadData={getListPost}
        loadindGetData={loadindGetDataSupervisor}
        typePost="supervisorThread"
      />
    </View>
  );
};

export default CieGestion;
