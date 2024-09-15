import { URLSearchParams } from 'url';
import { RequestOption, useContext } from '@modern-js/runtime/koa';

import ServicesConfig from '@api/_config/services';
import { MapLayer } from '@shared/_types';

const { mapServiceBaseUrl } = ServicesConfig();

export default async (
  communityId: string,
  worldId: string,
  mapId: string,
  opts?: RequestOption<{ layerIds: string[] }, undefined>,
): Promise<MapLayer[]> => {
  console.log('Inputs', communityId, worldId, mapId);
  const ctx = useContext();
  const { cookies } = ctx;
  const query = opts?.query;
  const sessionId = cookies.get('session-token');
  const userId = cookies.get('id-token');

  if (!sessionId || !userId) {
    console.warn('No Session Token or User Id found');
    ctx.res.statusCode = 401;
    return Promise.reject(new Error('Unauthorized. No session or user found.'));
  }

  let layerIds: string[] = [];
  if (Array.isArray(query?.layerIds)) {
    layerIds = [...query.layerIds];
  } else if (typeof query?.layerIds === 'string') {
    layerIds.push(query.layerIds);
  }
  const layerIdsQuery = layerIds.join(',');
  const searchParams = new URLSearchParams([
    ['layerIds', layerIdsQuery],
  ]).toString();

  const getLayersResponse = await fetch(
    `${mapServiceBaseUrl}/api/map/${mapId}/layer?${searchParams}`,
    {
      method: 'GET',
      headers: {
        'x-source': 'bff-service',
        'x-session-id': sessionId,
        'x-user-id': userId,
        'x-community-id': communityId,
        'x-world-id': worldId,
        'Content-Type': 'application/json',
      },
    },
  );

  if (!getLayersResponse.ok) {
    throw new Error(
      `Failed to fetch layers. Status: ${getLayersResponse.status}`,
    );
  }

  const layers: MapLayer[] = await getLayersResponse.json();
  console.log('Layers fetched', layers);

  return layers;
};

export const post = async (
  communityId: string,
  worldId: string,
  mapId: string,
  { data }: RequestOption<undefined, { layer: MapLayer; uploadKey: string }>,
): Promise<MapLayer> => {
  const ctx = useContext();
  const { cookies } = ctx;
  const sessionId = cookies.get('session-token');
  const userId = cookies.get('id-token');
  const { layer, uploadKey } = data;
  console.log('Inputs', communityId, worldId, data, layer);

  if (!sessionId || !userId) {
    console.warn('No Session Token or User Id found');
    ctx.res.statusCode = 401;
    return Promise.reject(new Error('Unauthorized. No session or user found.'));
  }

  const createLayerResponse = await fetch(
    `${mapServiceBaseUrl}/api/map/${mapId}/layer`,
    {
      method: 'PUT',
      headers: {
        'x-source': 'bff-service',
        'x-session-id': sessionId,
        'x-user-id': userId,
        'x-community-id': communityId,
        'x-world-id': worldId,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        layer,
        uploadKey,
      }),
    },
  );

  if (!createLayerResponse.ok) {
    throw new Error(
      `Failed to create map. Status: ${createLayerResponse.status}`,
    );
  }

  const newLayer = await createLayerResponse.json();
  console.log('New Layer created', newLayer);

  return newLayer;
};
