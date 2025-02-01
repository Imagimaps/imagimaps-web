import GetUserWorlds from '@api/bff/user/[userId]/worlds';
import { Community } from '@shared/types/community';
import { World } from '@shared/types/world';

export type PortalPageData = {
  userWorlds: World[];
  userCommunities: Community[];
};

export const loader = async (): Promise<PortalPageData> => {
  console.log('Loading Portal Page Data');
  const userWorlds = await GetUserWorlds();
  console.log('User Worlds:', userWorlds);
  return {
    userWorlds,
    userCommunities: [],
  };
};
