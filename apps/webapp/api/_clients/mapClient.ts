import ServicesConfig from '@api/_config/services';
import { UserCredentials } from 'types/auth';
import { MapApiContext } from 'types/map';

const { mapServiceBaseUrl } = ServicesConfig();

const MapClient = (userCredentials?: UserCredentials) => {
  const getMapLayerUploadUrl = async (mapCtx: MapApiContext) => {
    if (!userCredentials) {
      console.error('User credentials not provided');
      throw new Error('User credentials not provided');
    }

    const { communityId, worldId, mapId, mapLayerId } = mapCtx;
    if (!communityId || !worldId || !mapId || !mapLayerId) {
      console.error('Not enough Map context provided');
      throw new Error('Missing Map Context');
    }

    const response = await fetch(
      `${mapServiceBaseUrl}/api/map/tile/${communityId}/${worldId}/${mapId}/${mapLayerId}/upload`,
      {
        method: 'GET',
        headers: {
          'User-Id': userCredentials.userId,
          'Session-Id': userCredentials.sessionToken,
        },
      },
    );

    if (!response.ok) {
      console.error('Failed to get upload URL', response);
      throw new Error('Failed to get upload URL');
    }

    const responseParsed = await response.json();
    const { uploadUrl } = responseParsed;
    return uploadUrl as string;
  };

  return {
    getMapLayerUploadUrl,
  };
};

export default MapClient;
