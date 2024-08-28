import ServicesConfig from '@api/_config/services';
import { useContext } from '@modern-js/runtime/server';
import { World } from 'types/world';

const { userServiceBaseUrl } = ServicesConfig();

export default async (communityId: string, worldId: string): Promise<World> => {
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

  const worldDataResponse = await fetch(
    `${userServiceBaseUrl}/api/user/community/${communityId}/world/${worldId}`,
    {
      method: 'GET',
      headers: {
        'x-source': 'bff-service',
        'x-session-id': sessionId,
        'x-user-id': userId,
      },
    },
  );

  if (!worldDataResponse.ok) {
    throw new Error(
      `Failed to fetch data for world ${worldId}. Status: ${worldDataResponse.status}`,
    );
  }

  const worlds = (await worldDataResponse.json()) as World;
  console.log('Worlds:', worlds);

  return worlds;
};
