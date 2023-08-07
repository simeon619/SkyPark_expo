interface ContentType {
  text: string;
  media: string[];
}

export interface ForumItemType {
  id: string;
  createdAt: string;
  nbrResponse: number;
  content: ContentType;
}
