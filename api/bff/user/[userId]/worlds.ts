// import ServicesConfig from '@api/_config/services';
import { useContext } from '@modern-js/runtime/koa';
import { World } from '@shared/types/world';

// const { userServiceBaseUrl } = ServicesConfig();

export default async (): Promise<World[]> => {
  const ctx = useContext();
  const logger = ctx.log.child({ source: 'GET auth/user/details' });
  logger.debug('Get User Details');

  const sessionId = ctx.state.sessionId as string;
  const userId = ctx.cookies.get('id-token');
  logger.debug({ mgs: `Getting details for user`, userId, sessionId });

  return [];
};
