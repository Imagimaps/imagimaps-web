import { RequestOption, useContext } from '@modern-js/runtime/koa';

import ServicesConfig from '@api/_config/services';

const { userServiceBaseUrl } = ServicesConfig();

export const post = async ({
  data,
}: RequestOption<
  undefined,
  { communityId: string; groupId: string; blocked: boolean }
>): Promise<string> => {
  const ctx = useContext();
  const logger = ctx.log.child({ source: 'POST auth/user/[userId]/metadata' });
  const sessionId = ctx.state.sessionId as string;
  const userId = ctx.state.userId as string;
  const { communityId, groupId, blocked } = data;

  logger.debug({
    message: 'Update User Metadata',
    communityId,
    groupId,
    blocked,
  });

  const createWorldResponse = await fetch(
    `${userServiceBaseUrl}/api/user/community/${communityId}/world`,
    {
      method: 'POST',
      headers: {
        'x-source': 'bff-service',
        'x-session-id': sessionId,
        'x-user-id': userId,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    },
  );

  if (!createWorldResponse.ok) {
    throw new Error(
      `Failed to create world. Status: ${createWorldResponse.status}`,
    );
  }

  const newlyCreatedWorld = await createWorldResponse.json();
  logger.info('New World created', newlyCreatedWorld);

  return newlyCreatedWorld;
};
