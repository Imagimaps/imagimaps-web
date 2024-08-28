export type World = {
  id: string;
  name: string;
  description?: string;
  coverImage?: string;
  status: string;
  game?: string;
  owner: User;
  community: Community;
  mapIds: string[];
  currentlyAccessed?: boolean;
  lastAccessed?: Date;
};
