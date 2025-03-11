import AuthClient from '@api/_clients/authClient';
import MapClient from '@api/_clients/mapClient';
import { RequestOption, useContext } from '@modern-js/runtime/koa';
import { AuthorisationScopes } from '@shared/types/auth.enums';

export const post = async ({
  data,
}: RequestOption<
  undefined,
  { mapId: string; layerId: string; uploadKey: string }
>): Promise<void> => {
  const { mapId, layerId, uploadKey } = data;
  const ctx = useContext();
  const { cookies } = ctx;
  const idToken = cookies.get('id-token');
  const sessionToken = cookies.get('session-token');
  console.log(`Processing image upload for ${mapId} with key ${uploadKey}`);

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
  await mapClient.processLayerImageUpload(mapId, layerId, uploadKey);

  ctx.res.statusCode = 201;
  ctx.res.end();

  return Promise.resolve();
};
