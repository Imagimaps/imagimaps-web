import ServicesConfig from '@api/_config/services';
import { useContext } from '@modern-js/runtime/koa';
import { World } from '@shared/types/world';

const { userServiceBaseUrl } = ServicesConfig();

export default async (): Promise<World[]> => {
  const ctx = useContext();
  const logger = ctx.log.child({ source: 'GET auth/user/worlds' });
  logger.debug('Get User Worlds');

  const sessionId = ctx.state.sessionId as string;
  const userId = ctx.cookies.get('id-token');
  logger.debug({ mgs: `Getting worlds for user`, userId, sessionId });

  if (!userId) {
    throw new Error('User not found');
  }

  const getWorldsRes = await fetch(
    `${userServiceBaseUrl}/api/user/${userId}/worlds`,
    {
      method: 'GET',
      headers: {
        'x-source': 'bff-service',
        'x-session-id': sessionId,
        'x-user-id': userId,
        'Content-Type': 'application/json',
      },
    },
  );

  if (!getWorldsRes.ok) {
    throw new Error(`Failed to create world. Status: ${getWorldsRes.status}`);
  }

  const worlds: World[] = await getWorldsRes.json();

  return worlds;
};
