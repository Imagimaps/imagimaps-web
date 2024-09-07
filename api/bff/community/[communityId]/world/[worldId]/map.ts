import ServicesConfig from '@api/_config/services';
import { useContext } from '@modern-js/runtime/koa';
import { RequestOption } from '@modern-js/runtime/server';
import { Map } from '@shared/types/map';

const { mapServiceBaseUrl } = ServicesConfig();

export const post = async (
  communityId: string,
  worldId: string,
  { data }: RequestOption<undefined, { name: string; description: string }>,
): Promise<Map> => {
  const ctx = useContext();
  const { cookies } = ctx;
  const sessionId = cookies.get('session-token');
  const userId = cookies.get('id-token');
  console.log('Inputs', communityId, worldId, data);
  const { name, description } = data;

  if (!sessionId || !userId) {
    console.warn('No Session Token or User Id found');
    ctx.res.statusCode = 401;
    return Promise.reject(new Error('Unauthorized. No session or user found.'));
  }

  console.log(
    `Creating Map in Community: ${communityId} World: ${worldId} with name ${name}`,
  );

  const formData: Partial<Map> = {
    name,
    description,
    owner: userId,
  };

  const createMapResponse = await fetch(`${mapServiceBaseUrl}/api/map/`, {
    method: 'PUT',
    headers: {
      'x-source': 'bff-service',
      'x-session-id': sessionId,
      'x-user-id': userId,
      'x-community-id': communityId,
      'x-world-id': worldId,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });

  if (!createMapResponse.ok) {
    throw new Error(
      `Failed to create map. Status: ${createMapResponse.status}`,
    );
  }

  const newlyCreatedMap = await createMapResponse.json();
  console.log('New Map created', newlyCreatedMap);

  return newlyCreatedMap;
};
