import ServicesConfig from '@api/_config/services';
import { RequestOption, useContext } from '@modern-js/runtime/koa';
import { Map } from '@shared/_types';

const { mapServiceBaseUrl, userServiceBaseUrl } = ServicesConfig();

export const put = async (
  worldId: string,
  { data }: RequestOption<undefined, { name: string; description: string }>,
): Promise<Map> => {
  const ctx = useContext();
  const logger = ctx.log.child({ source: 'POST user/world/[worldId]' });
  const sessionId = ctx.state.sessionId as string;
  const userId = ctx.state.userId as string;
  const { name, description } = data;

  logger.debug({
    msg: 'Creating new map',
    userId,
    worldId,
    name,
    description,
    data,
  });

  const headers = {
    'x-source': 'bff-service',
    'x-session-id': sessionId,
    'x-user-id': userId,
    'Content-Type': 'application/json',
  };

  const createMapRes = await fetch(`${mapServiceBaseUrl}/api/map`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({ name, description, worldId }),
  });

  if (!createMapRes.ok) {
    throw new Error(`Failed to update world. Status: ${createMapRes.status}`);
  }

  const map: Map = await createMapRes.json();
  const addMapToWorldRes = await fetch(
    `${userServiceBaseUrl}/api/user/world/${worldId}/map`,
    {
      method: 'PUT',
      headers,
      body: JSON.stringify({ mapId: map.id }),
    },
  );

  if (!addMapToWorldRes.ok) {
    throw new Error(
      `Failed to add map to world. Status: ${addMapToWorldRes.status}`,
    );
  }

  console.log('World updated', map);

  return map;
};
