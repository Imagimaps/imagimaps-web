import GetUserMap from '@api/bff/user/map/[mapId]';
import { LoaderFunctionArgs } from '@modern-js/runtime/router';
import { Map } from '@shared/_types';

export type UserMapData = {
  map: Map;
};

export const loader = async ({
  params,
}: LoaderFunctionArgs): Promise<UserMapData> => {
  const { mapId } = params;
  if (!mapId) {
    throw new Error('No map id found');
  }
  const map = await GetUserMap(mapId);
  console.log('Loading User Map Data', map);
  return {
    map,
  };
};
