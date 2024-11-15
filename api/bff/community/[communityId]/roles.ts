import axios from 'axios';
import { useContext } from '@modern-js/runtime/koa';
import { Logger } from 'pino';
import { RequestOption } from '@modern-js/runtime/server';

import ServicesConfig from '@api/_config/services';
import { CommunityRole } from '@shared/types/community';

const { userServiceBaseUrl } = ServicesConfig();

export default async (communityId: string): Promise<CommunityRole[]> => {
  const ctx = useContext();
  const { sessionId, userId } = ctx.state as {
    sessionId: string;
    userId: string;
  };

  const rolesResponse = await axios.get(
    `${userServiceBaseUrl}/api/user/community/${communityId}/roles`,
    {
      headers: {
        'x-source': 'bff-service',
        'x-session-id': sessionId,
        'x-user-id': userId,
      },
      params: {
        load_users: true,
      },
    },
  );

  if (!rolesResponse || rolesResponse.status !== 200) {
    throw new Error(
      `Failed to fetch user groups. Status: ${rolesResponse.status}`,
    );
  }

  console.log('Groups:', rolesResponse.data);

  return rolesResponse.data;
};

export const post = async (
  communityId: string,
  { data }: RequestOption<undefined, { roles: CommunityRole[] }>,
): Promise<CommunityRole[]> => {
  const ctx = useContext();
  const logger: Logger = (ctx.log as Logger).child({
    source: 'POST community/[communityId]/roles.ts',
  });
  const { sessionId, userId } = ctx.state as {
    sessionId: string;
    userId: string;
  };
  const { roles } = data;

  if (!sessionId || !userId) {
    logger.info('No Session Token or User Id found');
    ctx.res.statusCode = 401;
    return Promise.reject(new Error('Unauthorized. No session or user found.'));
  }

  logger.info({
    message: 'Creating or updating roles',
    communityId,
    roles,
  });

  // TODO: Split array more cleverly
  const rolesToCreate = roles.filter(
    role => !role.id || role.id.startsWith('new/'),
  );
  const rolesToUpdate = roles
    .filter(role => role.id)
    .map(role => {
      role.permissions = role.permissions.map(permission => {
        logger.debug({ message: 'Permission', permission });
        if (!permission.id || permission.id.startsWith('new/')) {
          permission.id = '';
        }
        return permission;
      });
      return role;
    });
  logger.info({
    message: 'Split roles',
    rolesToCreate,
    rolesToUpdate,
  });

  const headers = {
    'x-source': 'bff-service',
    'x-session-id': sessionId,
    'x-user-id': userId,
    'Content-Type': 'application/json',
  };
  const createRolePromise = axios.put<CommunityRole[]>(
    `${userServiceBaseUrl}/api/user/community/${communityId}/roles`,
    rolesToCreate,
    {
      headers,
    },
  );
  const updateRolePromises = rolesToUpdate.map(role =>
    axios.post<CommunityRole>(
      `${userServiceBaseUrl}/api/user/community/${communityId}/role/${role.id}`,
      role,
      {
        headers,
      },
    ),
  );

  const [createRoleResponse, updateRoleResponses] = await Promise.all([
    createRolePromise,
    Promise.all(updateRolePromises),
  ]);
  if (
    createRoleResponse.status !== 200 ||
    updateRoleResponses.some(res => res.status !== 200)
  ) {
    throw new Error(
      `Failed to create or update role. Create Status: ${
        createRoleResponse.status
      } | Update Status: ${updateRoleResponses.map(r => r.status).join(', ')}`,
    );
  }

  const createdRoles = createRoleResponse.data;
  const updatedRoles = updateRoleResponses.map(res => res.data);
  logger.info({
    message: 'Roles updated or created',
    createdRoles,
    updatedRoles,
  });

  return [...createdRoles, ...updatedRoles];
};
