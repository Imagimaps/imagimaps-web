import { URL } from 'node:url';
import { v4 as uuidv4 } from 'uuid';
import { OAuth2Providers } from 'paper-glue';
import hash from 'object-hash';

export const getDiscordOAuth2TokenLink = () => {
  // TODO: Move to OAuth2 Service. This function becomes a GET call to that service
  const discordOauth2TokenLink = new URL('https://discord.com');
  discordOauth2TokenLink.pathname = '/api/oauth2/authorize';
  discordOauth2TokenLink.searchParams.append(
    'client_id',
    '1189425291450400849',
  );
  discordOauth2TokenLink.searchParams.append('response_type', 'code');
  discordOauth2TokenLink.searchParams.append(
    'redirect_uri',
    'http://localhost:8080/oauth/authorize',
  );
  discordOauth2TokenLink.searchParams.append('scope', 'identify guilds');
  discordOauth2TokenLink.searchParams.append('prompt', 'none');

  const state = {
    provider: OAuth2Providers.Discord,
    nonce: uuidv4(),
  };
  discordOauth2TokenLink.searchParams.append('state', hash(state));
  // TODO: Post the state along with the hash to auth service

  return discordOauth2TokenLink.toString();
};
