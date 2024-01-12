import { create } from 'zustand';
import { SQuery } from '../..';
import { PostInterface } from '../Descriptions';
import { useAuthStore } from '../auth';

type FavouriteSchema = {
  listPostFavourites: PostInterface[];
  loadindGetDataFavourites: boolean;
  getListPostFavourites: (page: number) => void;
};

export const useFavouritesStore = create<FavouriteSchema, any>((set) => ({
  listPostFavourites: [],
  loadindGetDataFavourites: false,

  getListPostFavourites: async (page: number) => {
    set({
      loadindGetDataFavourites: true,
    });

    const favouritesId = useAuthStore.getState().account?.favorites;
    if (!favouritesId) return;
    const favourite = await SQuery.newInstance('favorites', { id: favouritesId });

    if (!favourite) return;

    let listId = favourite?.elements?.map((element) => element.id);

    const listPost = await SQuery.collector({
      $option: {},
      post: listId || [],
    });

    const dataPosts = listPost.post.map((post) => post.$cache);

    set({
      listPostFavourites: dataPosts,
      loadindGetDataFavourites: false,
    });
  },
}));
