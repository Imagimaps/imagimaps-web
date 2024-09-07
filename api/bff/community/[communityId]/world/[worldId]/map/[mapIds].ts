import { URLSearchParams } from 'url';
import ServicesConfig from '@api/_config/services';
import { useContext } from '@modern-js/runtime/koa';
import { Map } from '@shared/types/map';

const { mapServiceBaseUrl } = ServicesConfig();

export default async (
  communityId: string,
  worldId: string,
  mapIds: string,
): Promise<Map[]> => {
  const ctx = useContext();
  const { cookies } = ctx;
  const sessionId = cookies.get('session-token');
  const userId = cookies.get('id-token');

  if (!sessionId || !userId) {
    console.warn('No Session Token or User Id found');
    ctx.res.statusCode = 401;
    ctx.throw('Unauthorized. No session or user found.');
    return Promise.reject(new Error('Unauthorized. No session or user found.'));
  }

  const searchParams = new URLSearchParams([['mapIds', mapIds]]).toString();
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
    throw new Error(`Failed to fetch map. Status: ${mapResponse.status}`);
  }

  const maps = (await mapResponse.json()) as Map[];
  console.log('Map:', maps);

  return maps;
};
