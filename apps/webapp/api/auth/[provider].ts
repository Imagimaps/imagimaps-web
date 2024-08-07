import { useContext, RequestOption } from '@modern-js/runtime/server';
import { OAuth2Providers } from 'paper-glue';
import { getDiscordOAuth2TokenLink } from './_discord';

export default async (provider: OAuth2Providers) => {
  console.log(provider);

  let tokenLink = '';
  switch (provider) {
    case OAuth2Providers.Discord:
      tokenLink = getDiscordOAuth2TokenLink();
      break;
    default:
      break;
  }

  return {
    tokenLink,
  };
};

type AuthTokenData = { provider: string; token: string };
export const post = async (
  provider: OAuth2Providers,
  { data }: RequestOption<undefined, AuthTokenData>,
) => {
  console.log('Post Handler for Auth');
  console.log(provider);
  console.log(`data is`, data);
  console.log(useContext);
  const ctx = useContext();
  const { cookies } = ctx;
  const idToken = cookies.get('id_token');
  const sessionToken = cookies.get('session_token');
  console.log(`id_token is ${idToken}, session_token is ${sessionToken}`);

  const res = await fetch('http://localhost:8081/token/validate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token: data.token, provider: data.provider }),
  });
  console.log(res);

  return {
    message: 'Server Accept',
  };
};
