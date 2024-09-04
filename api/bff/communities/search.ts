import ServicesConfig from '@api/_config/services';
import { useContext } from '@modern-js/runtime/server';
import { Community } from '@shared/types/community';

const { userServiceBaseUrl } = ServicesConfig();

export default async (): Promise<Community[]> => {
  const ctx = useContext();
  const { cookies } = ctx;
  const sessionId = cookies.get('session-token');
  const userId = cookies.get('id-token');
  console.log(ctx.headers);

  if (!sessionId || !userId) {
    console.warn('No Session Token or User Id found');
    ctx.res.statusCode = 401;
    ctx.throw('Unauthorized. No session or user found.');
    return Promise.reject(new Error('Unauthorized. No session or user found.'));
  }

  const joinableCommunitiesRes = await fetch(
    `${userServiceBaseUrl}/api/user/communities/search/`,
    {
      method: 'GET',
      headers: {
        'x-source': 'bff-service',
        'x-session-id': sessionId,
        'x-user-id': userId,
      },
    },
  );
  if (!joinableCommunitiesRes.ok) {
    throw new Error(
      `Failed to get auth links. Status: ${joinableCommunitiesRes.status}`,
    );
  }
  const joinableCommunities: Community[] = await joinableCommunitiesRes.json();
  console.log(joinableCommunities);

  return joinableCommunities;
};
