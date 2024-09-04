import ServicesConfig from '@api/_config/services';
import { RequestOption, useContext } from '@modern-js/runtime/server';

const { userServiceBaseUrl } = ServicesConfig();

export const post = async ({
  data,
}: RequestOption<undefined, { id: string }>): Promise<string> => {
  const ctx = useContext();
  const { cookies } = ctx;
  const sessionId = cookies.get('session-token');
  const userId = cookies.get('id-token');
  const communityId = data.id;

  if (!sessionId || !userId) {
    console.warn('No Session Token or User Id found');
    ctx.res.statusCode = 401;
    ctx.throw('Unauthorized. No session or user found.');
    return Promise.reject(new Error('Unauthorized. No session or user found.'));
  }

  console.log(`Joining community ${communityId}`);

  const joinCommunityResponse = await fetch(
    `${userServiceBaseUrl}/api/user/community/${communityId}/join`,
    {
      method: 'POST',
      headers: {
        'x-source': 'bff-service',
        'x-session-id': sessionId,
        'x-user-id': userId,
      },
    },
  );

  if (!joinCommunityResponse.ok) {
    throw new Error(
      `Failed to join community. Status: ${joinCommunityResponse.status}`,
    );
  }

  return communityId;
};
