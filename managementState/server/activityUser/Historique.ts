import { create } from 'zustand';
import { SQuery } from '../..';
import { PostInterface, MessageInterface, HistoriqueInterface } from '../Descriptions';
import { useAuthStore } from '../auth';
import { GroupeType } from './groupActivity';

type PostType = {
  post: PostInterface & { message: MessageInterface };
  value: string;
  mode: 'like' | 'create' | 'shared';
};
type Activity = {
  activity: GroupeType;
  value: string;
  mode: 'listen';
};
export type HistoriqueType = PostType | Activity;

type HistoriqueSchema = {
  listHistorique: Map<string, HistoriqueType>;
  getHistorique: () => void;
  loadingHistorique: boolean;
};

export const useHistoriqueStore = create<HistoriqueSchema, any>((set) => ({
  listHistorique: new Map(),
  loadingHistorique: false,
  getHistorique: async () => {
    set({
      loadingHistorique: true,
    });
    const historiqueId = useAuthStore.getState().account?.historique;
    if (!historiqueId) return;
    const historique = await SQuery.newInstance('historique', { id: historiqueId });
    if (!historique) return;

    let listCacheHistorique = await getListHistorique(historique.$cache);
    const newState = new Map();
    listCacheHistorique?.forEach((element) => {
      if (element.mode !== 'listen') {
        newState.set(element.post._id + element.mode, element);
      } else {
        newState.set(element.activity._id + element.mode, element);
      }
    });

    set({
      listHistorique: newState,
      loadingHistorique: false,
    });

    historique.when('refresh:elements', async (obj) => {
      let cacheHistorique = await getListHistorique(obj);

      if (!cacheHistorique) return;
      set((state) => {
        const newState = new Map(state.listHistorique);
        if (cacheHistorique[0].mode !== 'listen') {
          newState.set(cacheHistorique[0].post._id + cacheHistorique[0].mode, cacheHistorique[0]);
        } else {
          newState.set(cacheHistorique[0].activity._id + cacheHistorique[0].mode, cacheHistorique[0]);
        }
        return {
          listHistorique: newState,
          loadingHistorique: false,
        };
      });
    });
  },
}));

const getListHistorique = async (historique: Partial<HistoriqueInterface>) => {
  if (!historique) return;

  let promises = historique.elements?.map(async (element) => {
    return new Promise(async (resolve) => {
      if (element.modelName === 'post') {
        const post = await SQuery.newInstance('post', { id: element.id });
        resolve({
          post: {
            ...post?.$cache,
            message: (await post?.message)?.$cache,
          },
          value: element.value,
          mode: element.mode,
        });
      } else if (element.modelName === 'activity') {
        const activity = await SQuery.newInstance('activity', { id: element.id });
        resolve({
          activity: {
            ...activity?.$cache,
            poster: (await activity?.poster)?.$cache,
          },
          value: element.value,
          mode: element.mode,
        });
      }
    });
  });

  if (!promises) return;

  let list = (await Promise.allSettled(promises))
    .filter((s) => s.status === 'fulfilled')
    .map((s) => (s as any).value as PostType | Activity);

  return list;
};
