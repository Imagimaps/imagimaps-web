import type { User } from './user';

export type Community = {
  id: string;
  name: string;
  status: CommunityStatus;
  owner: User;
  admins: User[];
  description?: string;
  banner?: string | null;
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
