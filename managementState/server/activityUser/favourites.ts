import { create } from 'zustand';
import { SQuery } from '../..';
import { PostInterface } from '../Descriptions';
import { useAuthStore } from '../auth';

type FavouriteSchema = {
  listPostFavourites: PostInterface[];
  loadindGetDataFavourites: boolean;
  ownfavoritres: string[];
  getListPostFavourites: (page: number) => void;
  setListPostFavourites: (data: { id: string }) => void;
  removePostFavourites: (data: { id: string }) => void;
};

export const useFavouritesStore = create<FavouriteSchema, any>((set) => ({
  listPostFavourites: [],
  loadindGetDataFavourites: false,
  ownfavoritres: [],

  getListPostFavourites: async () => {
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
      ownfavoritres: listId,
    });
  },

  setListPostFavourites: async (data: { id: string }) => {
    set({
      loadindGetDataFavourites: true,
    });
    const favouritesId = useAuthStore.getState().account?.favorites;
    if (!favouritesId) return;
    const favourite = await SQuery.newInstance('favorites', { id: favouritesId });

    if (!favourite) return;
    if (!favourite.elements) favourite.elements = [];
    favourite.elements = [{ modelName: 'post', id: data.id }, ...favourite.elements];
    favourite.when(
      'refresh:elements',
      async () => {
        let listId = favourite?.elements?.map((element) => element.id);

        const listPost = await SQuery.collector({
          $option: {},
          post: listId || [],
        });
        set(() => ({
          listPostFavourites: listPost.post.map((post) => post.$cache),
          loadindGetDataFavourites: false,
          ownfavoritres: listId,
        }));
      },
      'favorites'
    );
  },
  removePostFavourites: async (data: { id: string }) => {
    set({
      loadindGetDataFavourites: true,
    });
    const favouritesId = useAuthStore.getState().account?.favorites;
    if (!favouritesId) return;
    const favourite = await SQuery.newInstance('favorites', { id: favouritesId });
    if (!favourite) return;
    if (!favourite.elements) favourite.elements = [];
    favourite.elements = favourite.elements.filter((element) => element.id !== data.id);
    favourite.when(
      'refresh:elements',
      async () => {
        let listId = favourite?.elements?.map((element) => element.id);
        const listPost = await SQuery.collector({
          $option: {},
          post: listId || [],
        });
        set(() => ({
          listPostFavourites: listPost.post.map((post) => post.$cache),
          loadindGetDataFavourites: false,
        }));
      },
      'favoritesRemove'
    );
  },
}));
