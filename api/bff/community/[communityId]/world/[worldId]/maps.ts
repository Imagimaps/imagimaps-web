import { URLSearchParams } from 'url';
import ServicesConfig from '@api/_config/services';
import { RequestOption, useContext } from '@modern-js/runtime/koa';
import { Map } from '@shared/_types';

const { mapServiceBaseUrl } = ServicesConfig();

export default async (
  communityId: string,
  worldId: string,
  { query }: RequestOption<{ mapIds: string[] }, undefined>,
): Promise<Map[]> => {
  const ctx = useContext();
  const { cookies } = ctx;
  const sessionId = cookies.get('session-token');
  const userId = cookies.get('id-token');

  console.log('Inputs', communityId, worldId, query);
  console.log(
    query,
    'mapIds',
    query.mapIds,
    'typeof',
    typeof query.mapIds,
    'isArray',
    Array.isArray(query.mapIds),
  );

  if (!sessionId || !userId) {
    console.warn('No Session Token or User Id found');
    ctx.res.statusCode = 401;
    ctx.throw('Unauthorized. No session or user found.');
    return Promise.reject(new Error('Unauthorized. No session or user found.'));
  }

  let mapIds: string[] = [];
  if (Array.isArray(query.mapIds)) {
    mapIds = [...query.mapIds];
  } else if (typeof query.mapIds === 'string') {
    mapIds.push(query.mapIds);
  }
  const mapIdsQuery = mapIds.join(',');
  const searchParams = new URLSearchParams([
    ['mapIds', mapIdsQuery],
  ]).toString();
  const mapResponse = await fetch(
    `${mapServiceBaseUrl}/api/map?${searchParams}`,
    {
      method: 'GET',
      headers: {
        'x-source': 'bff-service',
        'x-session-id': sessionId,
        'x-user-id': userId,
        'x-community-id': communityId,
        'x-world-id': worldId,
      },
    },
  );

  if (!mapResponse.ok) {
    throw new Error(`Failed to fetch maps. Status: ${mapResponse.status}`);
  }

  const maps = (await mapResponse.json()) as Map[];
  console.log('Map:', maps);

  return maps;
};
