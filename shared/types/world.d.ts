import type { Map } from '@shared/_types';
import type { User } from './user';
import type { Community } from './community';

export type World = {
  id: string;
  name: string;
  description?: string;
  coverImage?: string;
  status: string;
  game?: string;
  owner: User;
  community?: Community;
  mapIds: string[];
  maps?: Map[];
  active?: boolean;
  lastAccessed?: Date;
};
