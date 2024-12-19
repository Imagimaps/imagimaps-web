import axios from 'axios';
import { Logger } from 'pino';
import { useContext } from '@modern-js/runtime/koa';

import ServicesConfig from '@api/_config/services';

const { userServiceBaseUrl } = ServicesConfig();

export const DELETE = async (
  communityId: string,
  roleId: string,
): Promise<string> => {
  const ctx = useContext();
  const logger: Logger = (ctx.log as Logger).child({
    source: 'DELETE community/[communityId]/role/[roleId].ts',
  });
  const { sessionId, userId } = ctx.state as {
    sessionId: string;
    userId: string;
  };

  logger.info({
    message: 'Deleting role',
    communityId,
    roleId,
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

  return roleId;
};
