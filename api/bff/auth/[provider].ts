import { useContext } from '@modern-js/runtime/koa';
import { RequestOption } from '@modern-js/runtime/server';
import ServicesConfig from '@api/_config/services';
import { AuthCodeData, Session } from '@shared/types/auth';
import { User } from '@shared/types/user';
import { OAuth2Providers } from '@shared/types/auth.enums';

const { authServiceBaseUrl, userServiceBaseUrl } = ServicesConfig();

export default async (provider: OAuth2Providers) => {
  const ctx = useContext();
  const logger = ctx.log.child({ source: 'GET auth/[provider]' });
  logger.debug({
    message: 'Get Auth Links for Provider',
    provider,
  });

  logger.debug({
    message: 'Fetching Auth Links from:',
    endpoint: `GET ${authServiceBaseUrl}/api/auth/providers/`,
    headers: {
      'x-source': 'bff-service',
    },
  });
  try {
    const tokenLinksResponse = await fetch(
      `${authServiceBaseUrl}/api/auth/providers/`,
      {
        method: 'GET',
        headers: {
          'x-source': 'bff-service',
        },
      },
    );
    if (!tokenLinksResponse.ok) {
      throw new Error('Failed to get auth links', {
        cause: tokenLinksResponse.statusText,
      });
    }
    const tokenLinks = await tokenLinksResponse.json();
    logger.debug({
      message: `Received Auth Links for Providers`,
      links: tokenLinks,
    });
    const tokenLink = tokenLinks[provider];

    return {
      tokenLink,
    };
  } catch (error) {
    if (error instanceof TypeError) {
      logger.error({
        message: 'Network or Fetch Error',
        error: error.message,
      });
    } else {
      logger.error({
        message: 'Error fetching Auth Links',
        error,
      });
    }
    throw error;
  }
};

export const post = async (
  provider: OAuth2Providers,
  { data }: RequestOption<undefined, AuthCodeData>,
) => {
  const ctx = useContext();
  const logger = ctx.log.child({ source: 'POST auth/[provider]' });

  logger.info(
    'Establishing Session',
    provider,
    data,
    `${authServiceBaseUrl}/api/auth/session`,
  );
  const sessionResponse = await fetch(
    `${authServiceBaseUrl}/api/auth/session`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-source': 'bff-service',
      },
      body: JSON.stringify(data),
    },
  );

  if (!sessionResponse.ok) {
    throw new Error(
      `Error starting session. HTTP Status: ${sessionResponse.status}`,
    );
  }

  const session: Session = await sessionResponse.json();
  logger.info('Established Session', session);

  logger.debug('Getting UserDetails from:', `${userServiceBaseUrl}/api/user/`);
  const userDetailsResponse = await fetch(`${userServiceBaseUrl}/api/user/`, {
    method: 'GET',
    headers: {
      'x-source': 'bff-service',
      'x-session-id': session.id,
    },
  });

  if (!userDetailsResponse.ok) {
    throw new Error(
      `Error retrieving User Details. HTTP Status: ${userDetailsResponse.status}`,
    );
  }

  logger.debug('Extracting UserDetails from Response', userDetailsResponse);
  const userDetails: User & { externalId: string } =
    await userDetailsResponse.json();
  logger.info('UserDetails', userDetails);

  const setUserInSessionResponse = await fetch(
    `${authServiceBaseUrl}/api/auth/session/user`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-source': 'bff-service',
        'x-session-id': session.id,
      },
      body: JSON.stringify({
        userId: userDetails.id,
        userExternalId: userDetails.externalId,
      }),
    },
  );

  if (!setUserInSessionResponse.ok) {
    throw new Error(
      `Error setting User in Session. HTTP Status: ${setUserInSessionResponse.status}`,
    );
  }

  ctx.cookies.set('id-token', userDetails.id, {
    httpOnly: false,
    path: '/',
    expires: new Date(session.expiry),
    sameSite: 'strict',
  });

  ctx.cookies.set('session-token', session.id, {
    httpOnly: true,
    path: '/',
    expires: new Date(session.expiry),
    sameSite: 'strict',
  });

  ctx.res.statusCode = 200;
  ctx.res.setHeader('Content-Type', 'application/json');
  ctx.response.body = JSON.stringify(userDetails);
};
