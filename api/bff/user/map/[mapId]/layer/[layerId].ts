import MapClient from '@api/_clients/mapClient';
import { useContext } from '@modern-js/runtime/koa';
import { MapLayer } from '@shared/_types';

export default async (mapId: string, layerId: string): Promise<MapLayer> => {
  const ctx = useContext();
  const logger = ctx.log.child({
    source: 'GET user/map/[mapId]/layer/[layerId]',
  });
  const sessionId = ctx.state.sessionId as string;
  const userId = ctx.state.userId as string;
  const mapClient = MapClient({ userId, sessionToken: sessionId });

  logger.debug({
    msg: 'Fetching Layer',
    userId,
    mapId,
    layerId,
  });

  const layer = await mapClient.getLayer(mapId, layerId);

  logger.info({ msg: 'Layer Fetched', mapId, layerId, layer });

  return layer;
};

export const DELETE = async (mapId: string, layerId: string): Promise<void> => {
  const ctx = useContext();
  const logger = ctx.log.child({
    source: 'DELETE user/map/[mapId]/layer/[layerId]',
  });
  const sessionId = ctx.state.sessionId as string;
  const userId = ctx.state.userId as string;
  const mapClient = MapClient({ userId, sessionToken: sessionId });

  logger.debug({
    msg: 'Deleting Layer',
    userId,
    mapId,
    layerId,
  });

  await mapClient.deleteLayer(mapId, layerId);

  logger.info({ msg: 'Layer Deleted', mapId, layerId });

  ctx.response.status = 204;
};
