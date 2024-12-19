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
): Promise<{
  updatedRoles: CommunityRole[];
  createdRoles: CommunityRole[];
}> => {
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
    .filter(role => role.id && !role.id.startsWith('new/'))
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

  return {
    updatedRoles,
    createdRoles,
  };
};

export const DELETE = async (
  communityId: string,
  payload: RequestOption<undefined, { roleId: string }> & {
    params: Record<any, any>;
  },
): Promise<void> => {
  const ctx = useContext();
  const logger: Logger = (ctx.log as Logger).child({
    source: 'DELETE community/[communityId]/roles.ts',
  });
  const { sessionId, userId } = ctx.state as {
    sessionId: string;
    userId: string;
  };
  const { data, params } = payload;
  const { roleId } = data;

  logger.info({
    message: 'Deleting role',
    communityId,
    roleId,
    payload,
    params,
    data,
  });

  const headers = {
    'x-source': 'bff-service',
    'x-session-id': sessionId,
    'x-user-id': userId,
    'Content-Type': 'application/json',
  };

  const deleteRoleResponse = await axios.delete(
    `${userServiceBaseUrl}/api/user/community/${communityId}/role/${roleId}`,
    {
      headers,
    },
  );

  if (deleteRoleResponse.status !== 200) {
    throw new Error(
      `Failed to delete role. Status: ${deleteRoleResponse.status}`,
    );
  }

  logger.info({
    message: 'Role deleted',
    roleId,
  });
};
