import { URLSearchParams } from 'url';
import { RequestOption, useContext } from '@modern-js/runtime/koa';
import ServicesConfig from '@api/_config/services';
import { Map, UserMapMetadata } from '@shared/_types';

const { mapServiceBaseUrl } = ServicesConfig();

export default async (
  communityId: string,
  worldId: string,
  mapId: string,
  reqOpts?: RequestOption<{ eagerLoad: boolean }, undefined>,
): Promise<{
  map: Map;
  userMetadata: {
    layerId: string | null;
    position: { x: number; y: number };
    zoom: number;
  };
}> => {
  const ctx = useContext();
  const { cookies } = ctx;
  const { eagerLoad } = reqOpts?.query || { eagerLoad: false };
  const sessionId = cookies.get('session-token');
  const userId = cookies.get('id-token');

  if (!sessionId || !userId) {
    console.warn('No Session Token or User Id found');
    ctx.res.statusCode = 401;
    ctx.throw('Unauthorized. No session or user found.');
    return Promise.reject(new Error('Unauthorized. No session or user found.'));
  }

  const headers = {
    'x-source': 'bff-service',
    'x-session-id': sessionId,
    'x-user-id': userId,
    'x-community-id': communityId,
    'x-world-id': worldId,
  };

  const searchParams = new URLSearchParams([
    ['eagerLoad', String(eagerLoad)],
  ]).toString();
  const mapPromise = fetch(
    `${mapServiceBaseUrl}/api/map/${mapId}?${searchParams}`,
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

  const mapResponse = await mapPromise;
  if (!mapResponse.ok) {
    throw new Error(`Failed to fetch map. Status: ${mapResponse.status}`);
  }

  const userMetadataResponse = await userMetadataPromise;
  if (!userMetadataResponse.ok) {
    throw new Error(
      `Failed to fetch user metadata. Status: ${userMetadataResponse.status}`,
    );
  }

  const map = (await mapResponse.json()) as Map;
  const userMetadataDto = await userMetadataResponse.json();
  const userMetadata: UserMapMetadata = {
    layerId: userMetadataDto.activeLayerId,
    position: userMetadataDto.lastPosition,
    zoom: userMetadataDto.lastZoom,
  };
  console.log('Map:', map);
  console.log('User Metadata:', userMetadata);

  return { map, userMetadata };
};
