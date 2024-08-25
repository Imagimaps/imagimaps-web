import { useContext, RequestOption } from '@modern-js/runtime/server';
import { OAuth2Providers } from 'paper-glue';
import ServicesConfig from '@api/_config/services';
import { AuthCodeData, Session } from 'types/auth';
import { User } from 'types/user';

const { authServiceBaseUrl, userServiceBaseUrl } = ServicesConfig();

const STUB = false;

export default async (provider: OAuth2Providers) => {
  console.log(provider);

  if (STUB) {
    console.log('Stubbing response');
    return {
      tokenLink:
        // eslint-disable-next-line max-len
        'https://discord.com/api/oauth2/authorize?client_id=1189425291450400849&response_type=code&redirect_uri=http://localhost:8080/oauth/authorize&scope=identify%20guilds&prompt=none&state=5b9c4f5f-5f0c-4f4c-8f8c-1e7b1c7c5',
    };
  }

  const authLinksResponse = await fetch(
    `${authServiceBaseUrl}/api/auth/providers`,
    {
      method: 'GET',
      headers: {
        'x-source': 'bff-service',
      },
    },
  );
  if (!authLinksResponse.ok) {
    throw new Error('Failed to get auth links');
  }
  const tokenLinks = await authLinksResponse.json();
  console.log(tokenLinks);
  const tokenLink = tokenLinks[provider];

  return {
    tokenLink,
  };
};

export const post = async (
  provider: OAuth2Providers,
  { data }: RequestOption<undefined, AuthCodeData>,
) => {
  const ctx = useContext();

  if (STUB) {
    console.log('Stubbing response POST AuthToken');
    const expiresAt = new Date(new Date().getTime() + 1000 * 60 * 60 * 24);
    ctx.res.statusCode = 200;
    ctx.res.setHeader('Content-Type', 'application/json');
    ctx.cookies.set('id-token', '27d1ae8d-91a5-4ca8-92ea-090a2b606cca', {
      httpOnly: false,
      path: '/',
      expires: expiresAt, // 1 day into the future
      sameSite: 'strict',
    });

    ctx.cookies.set('session-token', '32b23230-b42d-43f5-8f9c-3ce96b5c3a78', {
      httpOnly: true,
      path: '/',
      expires: expiresAt,
      sameSite: 'strict',
    });

    ctx.res.end(
      JSON.stringify({
        user: {
          id: 'test-12345678',
          email: '',
          name: 'botagar',
          picture: 'd906c8f5708a517507e9160d44f4f880',
        },
        session: {
          id: '32b23230-b42d-43f5-8f9c-3ce96b5c3a78',
          expiry: new Date().toISOString(),
        },
      }),
    );

    return;
  }

  console.log(
    'Getting Session',
    provider,
    data,
    `${authServiceBaseUrl}/api/auth/user/session`,
  );
  const sessionResponse = await fetch(
    `${authServiceBaseUrl}/api/auth/user/session`,
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
  console.log('Established Session', session);

  console.log('Getting UserDetails from:', `${userServiceBaseUrl}/api/user`);
  const userDetailsResponse = await fetch(`${userServiceBaseUrl}/api/user`, {
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

  console.log('Extracting UserDetails from Response', userDetailsResponse);
  const userDetails: User = await userDetailsResponse.json();
  console.log('UserDetails', userDetails);

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

  console.log('Returning ctx', JSON.stringify(ctx.response));
};
