import ServicesConfig from '@api/_config/services';
import { RequestOption, useContext } from '@modern-js/runtime/koa';
import { World } from '@shared/types/world';
import type { Map } from '@shared/_types';

const { userServiceBaseUrl, mapServiceBaseUrl } = ServicesConfig();

export default async (worldId: string): Promise<World> => {
  const ctx = useContext();
  const logger = ctx.log.child({ source: 'GET user/world/[worldId]' });
  const sessionId = ctx.state.sessionId as string;
  const userId = ctx.cookies.get('id-token');

  if (!userId) {
    throw new Error('User not found');
  }

  const getWorldRes = await fetch(
    `${userServiceBaseUrl}/api/user/${userId}/world/${worldId}`,
    {
      method: 'GET',
      headers: {
        'x-source': 'bff-service',
        'x-session-id': sessionId,
        'x-user-id': userId,
        'Content-Type': 'application/json',
      },
    },
  );

  if (!getWorldRes.ok) {
    throw new Error(`Failed to get world. Status: ${getWorldRes.status}`);
  }

  const world: World = await getWorldRes.json();
  logger.info({ msg: 'Got world', world });

  if (world.mapIds.length > 0) {
    const getMapsRes = await fetch(
      `${mapServiceBaseUrl}/api/map?mapIds=${world.mapIds.join(',')}`,
      {
        method: 'GET',
        headers: {
          'x-source': 'bff-service',
          'x-session-id': sessionId,
          'x-user-id': userId,
          'Content-Type': 'application/json',
        },
      },
    );

    if (!getMapsRes.ok) {
      throw new Error(`Failed to get maps. Status: ${getMapsRes.status}`);
    }

    const maps: Map[] = await getMapsRes.json();
    logger.info({ msg: 'Got maps', maps });
    world.maps = maps;
  }

  return world;
};

export const post = async (
  worldId: string,
  { data }: RequestOption<undefined, { name: string; description: string }>,
): Promise<World> => {
  const ctx = useContext();
  const logger = ctx.log.child({ source: 'POST user/world/[worldId]' });
  const sessionId = ctx.state.sessionId as string;
  const userId = ctx.state.userId as string;
  const { name, description } = data;

  logger.debug({
    msg: 'Updating World',
    userId,
    worldId,
    name,
    description,
    data,
  });

  const { userServiceBaseUrl } = ServicesConfig();
  const updateWorldRes = await fetch(
    `${userServiceBaseUrl}/api/user/${userId}/world/${worldId}`,
    {
      method: 'POST',
      headers: {
        'x-source': 'bff-service',
        'x-session-id': sessionId,
        'x-user-id': userId,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, description }),
    },
  );

  if (!updateWorldRes.ok) {
    throw new Error(`Failed to update world. Status: ${updateWorldRes.status}`);
  }

  const updatedWorld: World = await updateWorldRes.json();
  console.log('World updated', updatedWorld);

  return updatedWorld;
};

export const DELETE = async (worldId: string) => {
  const ctx = useContext();
  const logger = ctx.log.child({ source: 'DELETE user/world/[worldId]' });
  const sessionId = ctx.state.sessionId as string;
  const userId = ctx.cookies.get('id-token') as string;

  if (!userId) {
    throw new Error('User not found');
  }

  const deleteWorldRes = await fetch(
    `${userServiceBaseUrl}/api/user/${userId}/world/${worldId}`,
    {
      method: 'DELETE',
      headers: {
        'x-source': 'bff-service',
        'x-session-id': sessionId,
        'x-user-id': userId,
        'Content-Type': 'application/json',
      },
    },
  );

  if (!deleteWorldRes.ok) {
    throw new Error(`Failed to delete world. Status: ${deleteWorldRes.status}`);
  }

  logger.info({ msg: 'Deleted world', worldId });
  ctx.response.status = 200;
  return { msg: 'World deleted successfully', worldId };
};
