import type { Map } from '@shared/_types';
import type { User } from './user';
import type { Community } from './community';

export type WorldIntrinsics = {
  name: string;
  status: string;
  description?: string;
  coverImage?: string;
  game?: string;
};

export type World = {
  id: string;
  intrinsics: WorldIntrinsics;
  owner: User;
  community?: Community;
  mapIds: string[];
  maps?: Map[];
  active?: boolean;
  lastAccessed?: Date;
};
