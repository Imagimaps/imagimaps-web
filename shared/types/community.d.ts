import type { User } from './user';

export type Community = {
  id: string;
  name: string;
  status: CommunityStatus;
  associatedGuildId: string;
  owner: User;
  admins: User[];
  description?: string;
  banner?: string | null;
  icon?: string | null;
  games?: string[];
};

export type JoinableCommunity = {
  id: string;
  name: string;
  joinable: boolean;
  isOwner: boolean;
  icon?: string | null;
  size?: number;
};

export type CommunityRole = {
  id: string;
  name: string;
  description?: string;
  permissions: CommunityPermission[];
};

export type CommunityPermission = {
  id: string;
  effect: string;
  action: string;
  resource: string;
  filterResource: string;
  filterType: string;
  filterValue: string;
};
