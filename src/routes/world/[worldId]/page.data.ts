import GetUserWorld from '@api/bff/user/world/[worldId]';
import { LoaderFunctionArgs } from '@modern-js/runtime/router';
import { World } from '@shared/types/world';

export type UserWorldData = {
  world: World;
};

export const loader = async ({
  params,
}: LoaderFunctionArgs): Promise<UserWorldData> => {
  const { worldId } = params;
  if (!worldId) {
    throw new Error('No world id found');
  }
  try {
    const world = await GetUserWorld(worldId);
    console.log('Loading User World Data', world);
    return {
      world,
    };
  } catch (error) {
    console.error('Failed to get user world', error);
    throw error;
  }
};
