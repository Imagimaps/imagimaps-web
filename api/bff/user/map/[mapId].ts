import ServicesConfig from '@api/_config/services';
import { useContext } from '@modern-js/runtime/koa';
import { Map } from '@shared/_types';

const { mapServiceBaseUrl } = ServicesConfig();

export default async (mapId: string): Promise<Map> => {
  const ctx = useContext();
  const logger = ctx.log.child({ source: 'GET user/world/[worldId]' });
  const sessionId = ctx.state.sessionId as string;
  const userId = ctx.cookies.get('id-token');

  if (!userId) {
    throw new Error('User not found');
  }

  const headers = {
    'x-source': 'bff-service',
    'x-session-id': sessionId,
    'x-user-id': userId,
    'Content-Type': 'application/json',
  };
  const getMap = await fetch(
    `${mapServiceBaseUrl}/api/map/${mapId}?eagerLoad=true`,
    {
      method: 'GET',
      headers,
    },
  );

  if (!getMap.ok) {
    throw new Error(`Failed to get map. Status: ${getMap.status}`);
  }

  const map: Map = await getMap.json();
  logger.info({ msg: 'Got map', map });

  return map;
};
