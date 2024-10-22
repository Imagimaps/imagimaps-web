import ServicesConfig from '@api/_config/services';
import { useContext } from '@modern-js/runtime/koa';
import { World } from '@shared/types/world';

const { userServiceBaseUrl } = ServicesConfig();

export default async (communityId: string): Promise<any> => {
  const ctx = useContext();
  const { sessionId, userId } = ctx.state as {
    sessionId: string;
    userId: string;
  };

  const worldsResponse = await fetch(
    `${userServiceBaseUrl}/api/user/community/${communityId}/worlds`,
    {
      method: 'GET',
      headers: {
        'x-source': 'bff-service',
        'x-session-id': sessionId,
        'x-user-id': userId,
      },
    },
  );

  if (!worldsResponse.ok) {
    throw new Error(`Failed to fetch worlds. Status: ${worldsResponse.status}`);
  }

  const worlds = (await worldsResponse.json()) as World[];
  console.log('Worlds:', worlds);

  return worlds;
};
