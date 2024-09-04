import ServicesConfig from '@api/_config/services';
import { useContext } from '@modern-js/runtime/server';
import { Community } from '@shared/types/community';

const { userServiceBaseUrl } = ServicesConfig();

export default async (communityId: string): Promise<Community> => {
  const ctx = useContext();
  const { cookies } = ctx;
  const sessionId = cookies.get('session-token');
  const userId = cookies.get('id-token');

  if (!sessionId || !userId) {
    console.warn('No Session Token or User Id found');
    ctx.res.statusCode = 401;
    ctx.throw('Unauthorized. No session or user found.');
    return Promise.reject(new Error('Unauthorized. No session or user found.'));
  }

  const communityDetailsResponse = await fetch(
    `${userServiceBaseUrl}/api/user/community/${communityId}/`,
    {
      method: 'GET',
      headers: {
        'x-source': 'bff-service',
        'x-session-id': sessionId,
        'x-user-id': userId,
      },
    },
  );

  if (!communityDetailsResponse.ok) {
    throw new Error(
      `Failed to fetch community details. Status: ${communityDetailsResponse.status}`,
    );
  }

  const communityDetails = (await communityDetailsResponse.json()) as Community;
  console.log('Community details:', communityDetails);

  return communityDetails;
};
