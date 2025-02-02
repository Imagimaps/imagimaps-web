import ServicesConfig from '@api/_config/services';
import { RequestOption, useContext } from '@modern-js/runtime/koa';
import { World } from '@shared/types/world';

export const put = async (
  userId: string,
  { data }: RequestOption<undefined, { name: string; description: string }>,
): Promise<World> => {
  const ctx = useContext();
  const logger = ctx.log.child({ source: 'PUT user/world' });
  const sessionId = ctx.state.sessionId as string;
  const authedUserId = ctx.state.userId as string;
  const { name, description } = data;

  logger.debug({
    msg: 'Create New World',
    userId,
    authedUserId,
    name,
    description,
    data,
  });

  const { userServiceBaseUrl } = ServicesConfig();
  const createWorldResponse = await fetch(
    `${userServiceBaseUrl}/api/user/${userId}/worlds`,
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
