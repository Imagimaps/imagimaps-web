import { useContext } from '@modern-js/runtime/koa';

import ServicesConfig from '@api/_config/services';

const { userServiceBaseUrl } = ServicesConfig();

export default async () => {
  const ctx = useContext();
  const logger = ctx.log.child({ source: 'GET auth/user/details' });
  logger.debug('Get User Details');

  const sessionId = ctx.state.sessionId as string;
  const userId = ctx.cookies.get('id-token');
  logger.debug(`Getting details for user: ${userId}`);

  const userDetailsResponse = await fetch(
    `${userServiceBaseUrl}/api/user/${userId}`,
    {
      method: 'GET',
      headers: {
        'x-source': 'bff-service',
        'x-session-id': sessionId,
      },
    },
  );
  if (!userDetailsResponse.ok) {
    throw new Error('Failed to get user details');
  }
  const userDetails = await userDetailsResponse.json();
  logger.debug(`User Details: ${JSON.stringify(userDetails)}`);

  return userDetails;
};
