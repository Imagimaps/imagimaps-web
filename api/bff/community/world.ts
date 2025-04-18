import ServicesConfig from '@api/_config/services';
import { useContext } from '@modern-js/runtime/koa';
import { RequestOption } from '@modern-js/runtime/server';
import { World } from '@shared/types/world';

const { userServiceBaseUrl } = ServicesConfig();

export const post = async ({
  data,
}: RequestOption<
  undefined,
  { name: string; description: string; communityId: string }
>): Promise<World> => {
  const ctx = useContext();
  const { cookies } = ctx;
  const sessionId = cookies.get('session-token');
  const userId = cookies.get('id-token');
  const { name, description, communityId } = data;

  if (!sessionId || !userId) {
    console.warn('No Session Token or User Id found');
    ctx.res.statusCode = 401;
    return Promise.reject(new Error('Unauthorized. No session or user found.'));
  }

  console.log(`Creating World in Community: ${communityId} with name ${name}`);

  const createWorldResponse = await fetch(
    `${userServiceBaseUrl}/api/user/community/${communityId}/world`,
    {
      method: 'PUT',
      headers: {
        'x-source': 'bff-service',
        'x-session-id': sessionId,
        'x-user-id': userId,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, description }),
    },
  );

  if (!createWorldResponse.ok) {
    throw new Error(
      `Failed to create world. Status: ${createWorldResponse.status}`,
    );
  }

  const newlyCreatedWorld: World = await createWorldResponse.json();
  console.log('New World created', newlyCreatedWorld);

  return newlyCreatedWorld;
};
