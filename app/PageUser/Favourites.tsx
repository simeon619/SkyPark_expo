import React from 'react';
import { View } from '../../components/Themed';
import PostIndex from '../../components/post/PostIndex';
import { useFavouritesStore } from '../../managementState/server/activityUser/favourites';

const Favourites = () => {
  const { getListPostFavourites, listPostFavourites, loadindGetDataFavourites } = useFavouritesStore((state) => state);
  return (
    <View style={{ flex: 1 }}>
      <PostIndex
        DATA={{
          added: [],
          items: listPostFavourites,
          hasNextPage: false,
          nextPage: 1,
          hasPrevPage: false,
          prevPage: 1,
          limit: 99,
          page: 1,
          pagingCounter: 1,
          removed: [],
          totalItems: 0,
          totalPages: 0,
        }}
        //@ts-ignore
        loadData={getListPostFavourites}
        loadindGetData={loadindGetDataFavourites}
        typePost="supervisorThread"
      />
    </View>
  );
};

export default Favourites;
