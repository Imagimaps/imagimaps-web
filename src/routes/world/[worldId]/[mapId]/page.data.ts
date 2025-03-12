import GetUserMap from '@api/bff/user/map/[mapId]';
import { LoaderFunctionArgs } from '@modern-js/runtime/router';
import { Map, UserMapMetadata } from '@shared/_types';

export type UserMapData = {
  map: Map;
  metadata: UserMapMetadata;
};

export const loader = async ({
  params,
}: LoaderFunctionArgs): Promise<UserMapData> => {
  const { mapId } = params;
  if (!mapId) {
    throw new Error('No map id found');
  }
  const mapData = await GetUserMap(mapId);
  console.log('Loading User Map Data', mapData);
  return {
    map: mapData.map,
    metadata: mapData.userMetadata,
  };
};
