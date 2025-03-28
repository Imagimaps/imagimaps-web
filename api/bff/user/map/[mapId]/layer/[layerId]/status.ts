import MapClient from '@api/_clients/mapClient';
import { useContext } from '@modern-js/runtime/koa';
import { MapLayerProcessingStatus } from '@shared/_types';

export default async (
  mapId: string,
  layerId: string,
): Promise<{
  status: string;
  processingStatus: MapLayerProcessingStatus;
}> => {
  const ctx = useContext();
  const logger = ctx.log.child({
    source: 'GET user/world/[worldId]/layer/[layerId]/status',
  });
  const sessionId = ctx.state.sessionId as string;
  const userId = ctx.cookies.get('id-token') as string;
  const mapClient = MapClient({ userId, sessionToken: sessionId });

  const layerStatus = await mapClient.getLayerStatus(mapId, layerId);
  logger.info({ msg: 'Successfully fetched layer status', layerStatus });

  return layerStatus;
};
