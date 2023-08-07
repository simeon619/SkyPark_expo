export const PostType = {
  TEXT: '1',
  T_MEDIA: '2',
  SURVEY: '3',
  GROUP_JOIN: '4',
};

export interface User {
  id: number;
  username: string;
  avatar: string;
}

export interface StatPostSchema {
  likes: number;
  comments: number;
  shares: number;
}
export interface SurveySchema {
  options: { id: number; label: string; votes: number }[];
  totalVotes: number;
}
export interface groupJoinedSchema {
  pic: string;
  name: string;
  banner: string;
}
export interface ContentSchema {
  text?: string;
  media?: string[];
  survey?: SurveySchema;
  groupJoin?: groupJoinedSchema;
}

export interface PostSchema {
  id: number;
  type: string;
  user: User;
  content: ContentSchema;
  createdAt: any;
  statPost: StatPostSchema;
}
