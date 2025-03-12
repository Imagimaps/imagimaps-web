import MapClient from '@api/_clients/mapClient';
import { useContext } from '@modern-js/runtime/koa';

export const DELETE = async (mapId: string, layerId: string): Promise<void> => {
  const ctx = useContext();
  const logger = ctx.log.child({
    source: 'DELETE user/map/[mapId]/layer/[layerId]',
  });
  const sessionId = ctx.state.sessionId as string;
  const userId = ctx.state.userId as string;

  logger.debug({
    msg: 'Deleting Layer',
    userId,
    mapId,
    layerId,
  });

  const mapClient = MapClient({ userId, sessionToken: sessionId });

  await mapClient.deleteLayer(mapId, layerId);

  logger.info({ msg: 'Layer Deleted', mapId, layerId });

  ctx.response.status = 204;
};
