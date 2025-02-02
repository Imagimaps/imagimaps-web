// import GetUserWorlds from '@api/bff/user/worlds';
import { LoaderFunctionArgs } from '@modern-js/runtime/router';
import { World } from '@shared/types/world';

export type UserWorldData = {
  world: World;
};

export const loader = async ({
  params,
}: LoaderFunctionArgs): Promise<UserWorldData> => {
  const { worldId } = params;
  console.log('Loading User World Data', worldId);
  return {
    world: {
      id: '12345678',
      name: 'stub world',
      description: 'World Description',
      status: 'active',
      owner: {
        id: 'ownerId',
        name: 'ownerName',
        picture: 'ownerPicture',
      },
      mapIds: [],
    },
  };
};
