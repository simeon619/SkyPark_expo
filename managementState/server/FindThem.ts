import { create } from 'zustand';
import { combine } from 'zustand/middleware';
import { SQuery } from '..';
import { UrlData } from '../../lib/SQueryClient';
import { ProfileInterface, CacheValues } from './Descriptions';
export type UserProfile = {
  _id: string;
  email: string;
  name: string;
  profile: {
    _id: string;
    banner: UrlData[];
    imgProfile: UrlData[];
  };
  status: string;
  telephone: string;
  userTarg: string;
};
interface Message {
  _id: string;
  account: {
    _id: string;
    email: string;
    name: string;
    profile: {
      _id: string;
      banner: string[];
      imgProfile: string[];
    };
    status: string;
    telephone: string;
    userTarg: string;
  };
  targets: any[]; // Le type exact dépendrait du contenu réel de votre "targets"
  text: string;
}
export type Post = {
  _id: string;
  type: string;
  message: Message;
};

export type ActivityPost = {
  _id: string;
  name: string;
  poster: ProfileInterface;
};
const useFindThem = create(
  combine(
    {
      listActivity: [] as ActivityPost[],
      listAccount: [] as UserProfile[],
      listForum: [],
      listPost: [] as Post[],
    },
    (set) => ({
      getList: async ({ value }: { value: string }) => {
        //@ts-ignore
        const find = await SQuery.service('Trouve', 'les', {
          limit: 5,
          page: 1,
          value,
          // "index" :  "account" | "post" | "activity"
        });

        set({
          listActivity: find.response?.activity || [],
          listAccount: find.response?.accounts || [],
          listForum: find.response?.postsTiltle || [],
          listPost: find.response?.postsText || [],
        });
      },
    })
  )
);

export default useFindThem;
