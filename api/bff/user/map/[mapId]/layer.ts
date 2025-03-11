import { RequestOption, useContext } from '@modern-js/runtime/koa';
import { MapLayer } from '@shared/_types';
import ServicesConfig from '@api/_config/services';
// import MapClient from '@api/_clients/mapClient';

const { mapServiceBaseUrl } = ServicesConfig();

export const put = async (
  mapId: string,
  { data }: RequestOption<undefined, { layer: MapLayer }>,
): Promise<MapLayer> => {
  const ctx = useContext();
  const logger = ctx.log.child({ source: 'PUT user/map/[mapId]/layer' });
  const sessionId = ctx.state.sessionId as string;
  const userId = ctx.state.userId as string;
  const { layer } = data;

  logger.debug({
    msg: 'Creating new Layer',
    userId,
    mapId,
    data,
  });

  const headers = {
    'x-source': 'bff-service',
    'x-session-id': sessionId,
    'x-user-id': userId,
    'Content-Type': 'application/json',
  };

  const createLayerRes = await fetch(
    `${mapServiceBaseUrl}/api/map/${mapId}/layer`,
    {
      method: 'PUT',
      headers,
      body: JSON.stringify({ layer }),
    },
  );

  if (!createLayerRes.ok) {
    logger.error({
      msg: 'Failed to create layer',
      status: createLayerRes.status,
      reason: createLayerRes.statusText,
    });
    throw new Error(`Failed to create layer. Status: ${createLayerRes.status}`);
  }

  const newLayer: MapLayer = await createLayerRes.json();

  console.log('Layer Created', newLayer);

  return newLayer;
};

export const post = async (
  mapId: string,
  { data }: RequestOption<undefined, { layer: MapLayer }>,
): Promise<MapLayer> => {
  const ctx = useContext();
  const logger = ctx.log.child({ source: 'POST user/map/[mapId]/layer' });
  const sessionId = ctx.state.sessionId as string;
  const userId = ctx.state.userId as string;
  // const mapClient = MapClient({ userId, sessionToken: sessionId });
  const { layer } = data;

  logger.debug({
    msg: 'Updating Layer',
    userId,
    mapId,
    data,
  });

  const headers = {
    'x-source': 'bff-service',
    'x-session-id': sessionId,
    'x-user-id': userId,
    'Content-Type': 'application/json',
  };

  const updateLayerRes = await fetch(
    `${mapServiceBaseUrl}/api/map/${mapId}/layer`,
    {
      method: 'POST',
      headers,
      body: JSON.stringify({ layer }),
    },
  );

  if (!updateLayerRes.ok) {
    logger.error({
      msg: 'Failed to update layer',
      status: updateLayerRes.status,
      reason: updateLayerRes.statusText,
    });
    throw new Error(`Failed to update layer. Status: ${updateLayerRes.status}`);
  }

  const updatedLayer: MapLayer = await updateLayerRes.json();

  console.log('Layer Updated', updatedLayer);

  return updatedLayer;
};
