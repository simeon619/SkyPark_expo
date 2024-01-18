import { create } from 'zustand';
import { SQuery } from '../..';
import { useAuthStore } from '../auth';
import { AccountInterface, ActivityInterface, ProfileInterface } from '../Descriptions';
import { ArrayData } from '../../../lib/SQueryClient';

export type GroupeType = ActivityInterface & { poster: ProfileInterface } & {
  listAccount: AccountInterface & { profile: ProfileInterface }[];
};
type GroupSchema = {
  listGroupe: GroupeType[];
  loadingGroupe: boolean;
  getGroupe: () => void;
};

export const useGroupActivity = create<GroupSchema, any>((set) => ({
  listGroupe: [],
  loadingGroupe: false,
  getGroupe: async () => {
    set({
      loadingGroupe: true,
    });
    const quarterId = useAuthStore.getState().quarter?._id;

    if (!quarterId) return;

    const quarter = await SQuery.newInstance('quarter', { id: quarterId });
    let activities = await quarter?.activities;
    let activitiespage = await activities?.update({
      paging: {
        page: 1,
        limit: 100,
      },
    });

    activitiespage?.itemsInstance.forEach(async (itemP) => {
      let item = await itemP;
      item?.when(
        'refresh',
        async (obj) => {
          set({
            loadingGroupe: false,
          });
          let onlyActivity = await getListGroup({
            activity: {
              added: [],
              hasNextPage: false,
              items: [obj as ActivityInterface],
              hasPrevPage: false,
              limit: 0,
              nextPage: 0,
              page: 0,
              pagingCounter: 0,
              prevPage: 0,
              removed: [],
              totalItems: 0,
              totalPages: 0,
            },
          });

          set((state) => {
            const updatedListGroupe = state.listGroupe.map((item) => {
              if (item._id === onlyActivity[0]._id) {
                return {
                  ...item,
                  ...onlyActivity[0],
                  listen: Boolean(onlyActivity[0].listAbonne.find((ab) => ab === useAuthStore.getState().account?._id)),
                };
              }
              return item;
            });
            return {
              listGroupe: updatedListGroupe,
            };
          });
        },
        item.$id
      );
    });
    // for (let i = 0; i < (activitiespage?.itemsInstance.length || 0); i++) {
    //   let item = await activitiespage?.itemsInstance[i];
    // }

    // @ts-ignore
    let Grupactivity = await getListGroup({ activity: activitiespage });
    set({
      listGroupe: Grupactivity,
      loadingGroupe: false,
    });
  },
}));

const getListGroup = async ({ activity }: { activity: ArrayData<ActivityInterface> }) => {
  let promises = activity?.items.map((item) => {
    return new Promise(async (resolve) => {
      let posterId = item.poster;
      const poster = await SQuery.newInstance('profile', { id: posterId });
      const listAccount = await SQuery.collector({
        $option: {},
        account: item.listAbonne || [],
      });

      let listProfileId = listAccount.account.map((account) => {
        return account.$cache.profile || '';
      });

      const profileCollector = await SQuery.collector({
        $option: {},
        profile: listProfileId,
      });

      let accountWithImg = listAccount.account.map((a) => {
        return {
          ...a,
          profile: profileCollector.profile.find((p) => p.$id === a.$cache.profile)?.$cache!,
        };
      });

      if (!poster) return new Error('poster not found');
      resolve({
        ...item,
        poster: poster?.$cache,
        listAccount: accountWithImg,
      });
    });
  });
  let Ga = (await Promise.allSettled(promises))
    .filter((s) => s.status === 'fulfilled')
    .map((s) => {
      return (s as any).value as GroupeType;
    });

  return Ga;
};

export const upDownGroup = async ({ id }: { id: string }) => {
  const activity = await SQuery.newInstance('activity', { id });

  if (!activity) throw new Error('activity not found');

  activity.listen = !activity.listen;
};
