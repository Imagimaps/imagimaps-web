import { URLSearchParams } from 'url';
import ServicesConfig from '@api/_config/services';
import { UserCredentials } from '@shared/types/auth';
import { MapApiContext } from '@shared/types/map';
import { GetImageUploadUrlResponse } from './mapclient.types';

const { mapServiceBaseUrl } = ServicesConfig();

const MapClient = (userCredentials?: UserCredentials) => {
  const getMapLayerUploadUrl = async (
    mapCtx: MapApiContext,
    filename: string,
  ) => {
    if (!userCredentials) {
      console.error('User credentials not provided');
      throw new Error('User credentials not provided');
    }

    const { communityId, worldId, mapId } = mapCtx;
    if (!communityId || !worldId || !mapId) {
      console.error('Not enough Map context provided');
      throw new Error('Missing Map Context');
    }

    const getParams = new URLSearchParams([['filename', filename]]).toString();
    const response = await fetch(
      `${mapServiceBaseUrl}/api/map/tile/${communityId}/${worldId}/${mapId}/upload?${getParams}`,
      {
        method: 'GET',
        headers: {
          'x-source': 'bff-service',
          'x-user-id': userCredentials.userId,
          'x-session-id': userCredentials.sessionToken,
        },
      },
    );

    if (!response.ok) {
      console.error('Failed to get upload URL', response);
      throw new Error('Failed to get upload URL');
    }

    const responseParsed: GetImageUploadUrlResponse = await response.json();
    return responseParsed;
  };

  return {
    getMapLayerUploadUrl,
  };
};

export default MapClient;
