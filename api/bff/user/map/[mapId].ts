import ServicesConfig from '@api/_config/services';
import { useContext } from '@modern-js/runtime/koa';
import { Map, UserMapMetadata } from '@shared/_types';

const { mapServiceBaseUrl } = ServicesConfig();

export default async (
  mapId: string,
): Promise<{ map: Map; userMetadata: UserMapMetadata }> => {
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
  const getMapPromise = await fetch(
    `${mapServiceBaseUrl}/api/map/${mapId}?eagerLoad=true`,
    {
      method: 'GET',
      headers,
    },
  );

  const userMetadataPromise = fetch(
    `${mapServiceBaseUrl}/api/map/${mapId}/user/${userId}/metadata`,
    {
      method: 'GET',
      headers,
    },
  );

  const [getMapRes, userMetadataRes] = await Promise.all([
    getMapPromise,
    userMetadataPromise,
  ]);

  if (!getMapRes.ok) {
    throw new Error(`Failed to get map. Status: ${getMapRes.status}`);
  }
  if (!userMetadataRes.ok) {
    throw new Error(
      `Failed to get user metadata. Status: ${userMetadataRes.status}`,
    );
  }

  const map: Map = await getMapRes.json();
  const userMetadatDto = await userMetadataRes.json();
  const userMetadata: UserMapMetadata = {
    layerId: userMetadatDto.activeLayerId,
    position: userMetadatDto.lastPosition,
    zoom: userMetadatDto.lastZoom,
  };
  logger.info({ msg: 'Got map', map });
  logger.info({ msg: 'Got user metadata', userMetadata });

  return { map, userMetadata };
};
