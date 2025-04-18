import MapClient from '@api/_clients/mapClient';
import { useContext } from '@modern-js/runtime/koa';
import { Map, UserMapMetadata } from '@shared/_types';

export default async (
  mapId: string,
): Promise<{ map: Map; userMetadata: UserMapMetadata }> => {
  const ctx = useContext();
  const logger = ctx.log.child({ source: 'GET user/map/[mapId]' });
  const sessionId = ctx.state.sessionId as string;
  const userId = ctx.cookies.get('id-token') as string;

  if (!userId) {
    throw new Error('User not found');
  }
  const mapClient = MapClient({ sessionToken: sessionId, userId });

  const { map, userMetadata } = await mapClient.getMap(mapId, {
    loadUserMetadata: true,
  });

  logger.info({ msg: 'Fetched Map', map });
  logger.info({ msg: 'Fetched User Metadata', userMetadata });

  return { map, userMetadata };
};

export const DELETE = async (mapId: string) => {
  const ctx = useContext();
  const logger = ctx.log.child({ source: 'DELETE user/map/[mapId]' });
  const sessionId = ctx.state.sessionId as string;
  const userId = ctx.cookies.get('id-token') as string;

  if (!userId) {
    throw new Error('User not found');
  }
  const mapClient = MapClient({ sessionToken: sessionId, userId });

  await mapClient.deleteMap(mapId);

  logger.info({ msg: 'Deleted Map', mapId });
  ctx.response.status = 200;
  return { msg: 'Map deleted successfully', mapId };
};
