import { useContext, RequestOption } from '@modern-js/runtime/server';
import { OAuth2Providers } from 'paper-glue';
import ServicesConfig from '@api/_config/services';
import { v4 as uuidv4 } from 'uuid';
import { AuthCodeData, AuthCodeResponse } from 'types/auth';

const { authServiceBaseUrl } = ServicesConfig();

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
    `${authServiceBaseUrl}/api/auth/user/authenticate`,
    {
      method: 'GET',
      headers: {
        'Bff-Session-Id': 'test-12345678',
        Nonce: uuidv4(),
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
  const { cookies } = ctx;
  const idToken = cookies.get('id-token');
  const sessionToken = cookies.get('session-token');
  console.log(`id-token is ${idToken}, session-token is ${sessionToken}`);

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

    return ctx;
  }

  const res = await fetch(`${authServiceBaseUrl}/api/auth/user/authenticate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  console.log(res);

  if (!res.ok) {
    console.error('Failed to authenticate user', res);
    ctx.res.statusCode = res.status;
    return ctx;
  }

  const userDetails = (await res.json()) as AuthCodeResponse;
  console.log('User Details', userDetails);
  if (!userDetails?.user && !userDetails?.session) {
    ctx.res.statusCode = 500;
    console.error('Failed to get user details', res);
    return ctx;
  }

  const { id } = userDetails.user;
  const { id: sessionId, expiry } = userDetails.session;
  ctx.cookies.set('id-token', id, {
    httpOnly: false,
    path: '/',
    expires: new Date(expiry),
    sameSite: 'strict',
  });

  ctx.cookies.set('session-token', sessionId, {
    httpOnly: true,
    path: '/',
    expires: new Date(expiry),
    sameSite: 'strict',
  });

  ctx.res.statusCode = 200;
  ctx.res.setHeader('Content-Type', 'application/json');
  ctx.res.end(JSON.stringify(userDetails));

  console.log('Returning ctx', JSON.stringify(ctx.response));

  return ctx;
};
