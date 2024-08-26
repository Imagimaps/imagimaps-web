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
