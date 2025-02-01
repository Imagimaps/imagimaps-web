import { RequestOption, useContext } from '@modern-js/runtime/koa';
import { World } from '@shared/types/world';

export const put = async (
  userId: string,
  { data }: RequestOption<undefined, { name: string; description: string }>,
): Promise<World> => {
  const ctx = useContext();
  const logger = ctx.log.child({ source: 'PUT user/world' });
  // const sessionId = ctx.state.sessionId as string;
  // const authedUserId = ctx.state.userId as string;
  const { name, description } = data;

  logger.debug({
    msg: 'Create New World',
    userId,
    name,
    description,
    data,
  });

  // const createWorldResponse = await fetch(
  //   `${userServiceBaseUrl}/api/user/community/${communityId}/world`,
  //   {
  //     method: 'POST',
  //     headers: {
  //       'x-source': 'bff-service',
  //       'x-session-id': sessionId,
  //       'x-user-id': userId,
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({ name }),
  //   },
  // );

  // if (!createWorldResponse.ok) {
  //   throw new Error(
  //     `Failed to create world. Status: ${createWorldResponse.status}`,
  //   );
  // }

  // const newlyCreatedWorld = await createWorldResponse.json();
  // console.log('New World created', newlyCreatedWorld);

  return {
    id: '123',
    name,
    description,
    status: 'active',
    mapIds: [],
    owner: {
      id: '123',
      displayName: 'User',
      name: 'user',
      picture: 'https://via.placeholder.com/50',
    },
    coverImage: undefined,
  };
};
