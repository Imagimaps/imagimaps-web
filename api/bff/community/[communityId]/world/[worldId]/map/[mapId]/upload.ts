import AuthClient from '@api/_clients/authClient';
import MapClient from '@api/_clients/mapClient';
import { GetImageUploadUrlResponse } from '@api/_clients/mapclient.types';
import { RequestOption, useContext } from '@modern-js/runtime/koa';
import { AuthorisationScopes } from '@shared/types/auth.enums';

export default async (
  communityId: string,
  worldId: string,
  mapId: string,
  { query }: RequestOption<{ filename: string }, undefined>,
): Promise<GetImageUploadUrlResponse | undefined> => {
  const { filename } = query || {};
  console.log(
    `Getting Upload URL for ${communityId}.${worldId}.${mapId}.${filename}`,
  );
  console.log('Filename', filename);
  const ctx = useContext();
  const { cookies } = ctx;
  const idToken = cookies.get('id-token');
  const sessionToken = cookies.get('session-token');

  if (!idToken || !sessionToken) {
    console.error('User not authenticated');
    ctx.res.statusCode = 401;
    ctx.res.end();
    return undefined;
  }

  const authClient = AuthClient({ userId: idToken, sessionToken });
  const isAuthorised = await authClient.authoriseScope([
    AuthorisationScopes.CREATE_MAP_LAYER,
  ]);

  if (!isAuthorised) {
    console.error('User not authorised to upload to this map');
    ctx.res.statusCode = 403;
    ctx.res.end();
    return undefined;
  }

  const mapClient = MapClient({ userId: idToken, sessionToken });
  const mapCtx = {
    communityId,
    worldId,
    mapId,
  };
  const uploadCtx = await mapClient.getMapLayerUploadUrl(mapCtx, filename);

  return uploadCtx;
};
