import { RequestOption, useContext } from '@modern-js/runtime/koa';
import { MapLayer } from '@shared/_types';
import ServicesConfig from '@api/_config/services';

const { mapServiceBaseUrl } = ServicesConfig();

export const put = async (
  mapId: string,
  { data }: RequestOption<undefined, { uploadKey: string; layer: MapLayer }>,
): Promise<MapLayer> => {
  const ctx = useContext();
  const logger = ctx.log.child({ source: 'POST user/world/[mapId]' });
  const sessionId = ctx.state.sessionId as string;
  const userId = ctx.state.userId as string;
  const { uploadKey, layer } = data;

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
      body: JSON.stringify({ uploadKey, layer }),
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
