import UpdateMapCommand from '@api/_commands/UpdateMapCommand';
import ServicesConfig from '@api/_config/services';
import { RequestOption, useContext } from '@modern-js/runtime/koa';
import { Map } from '@shared/_types';

const { mapServiceBaseUrl, userServiceBaseUrl } = ServicesConfig();

export const put = async (
  worldId: string,
  { data }: RequestOption<undefined, { name: string; description: string }>,
): Promise<Map> => {
  const ctx = useContext();
  const logger = ctx.log.child({ source: 'PUT user/world/[worldId]/map' });
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

  logger.debug({
    msg: 'Create Map Request',
    endpoint: `PUT ${mapServiceBaseUrl}/api/map/`,
    headers,
    body: JSON.stringify({ name, description, worldId }),
  });
  const createMapRes: Response = await fetch(`${mapServiceBaseUrl}/api/map/`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({ name, description, worldId }),
  });

  if (!createMapRes.ok) {
    logger.error({
      msg: 'Error creating map',
      response: JSON.stringify({
        status: createMapRes.status,
        statusText: createMapRes.statusText,
      }),
      endpoint: `PUT ${mapServiceBaseUrl}/api/map/`,
    });
    throw new Error(`Failed to update world. Status: ${createMapRes.status}`);
  }

  const map: Map = await createMapRes.json();
  logger.debug({
    msg: 'Register Map in World Request',
    endpoint: `PUT ${userServiceBaseUrl}/api/user/world/${worldId}/map`,
    headers,
    body: JSON.stringify({ mapId: map.id }),
  });
  const addMapToWorldRes = await fetch(
    `${userServiceBaseUrl}/api/user/world/${worldId}/map`,
    {
      method: 'PUT',
      headers,
      body: JSON.stringify({ mapId: map.id }),
    },
  );

  if (!addMapToWorldRes.ok) {
    logger.error({
      msg: 'Failed to add map to world',
      response: JSON.stringify({
        status: addMapToWorldRes.status,
        statusText: addMapToWorldRes.statusText,
      }),
    });
    throw new Error(
      `Failed to add map to world. Status: ${addMapToWorldRes.status}`,
    );
  }

  logger.info({ msg: 'World updated', map });

  return map;
};

export const post = async (
  worldId: string,
  { data }: RequestOption<undefined, { map: Map }>,
): Promise<Map> => {
  const ctx = useContext();
  const logger = ctx.log.child({ source: 'POST user/world/[worldId]' });
  const sessionId = ctx.state.sessionId as string;
  const userId = ctx.state.userId as string;
  const { map: mapData } = data;
  const {
    intrinsics: { name, description },
    id,
  } = mapData;

  logger.debug({
    msg: 'Updating existing map',
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
  const updateMapEndpoint = `${mapServiceBaseUrl}/api/map/${id}`;
  const command: UpdateMapCommand = {
    type: 'updateMap',
    payload: { map: mapData, worldId },
  };
  logger.debug({
    msg: 'Updating map',
    updateMapEndpoint,
    map: mapData,
  });
  const updateMapRes = await fetch(updateMapEndpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify(command),
  });

  if (!updateMapRes.ok) {
    throw new Error(`Failed to update map. Status: ${updateMapRes.status}`);
  }

  const map: Map = await updateMapRes.json();

  logger.info({ msg: 'Map updated', map });

  return map;
};
