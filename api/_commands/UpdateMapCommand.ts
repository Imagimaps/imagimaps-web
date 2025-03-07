import { Map } from 'shared/_types';

type UpdateMapCommand = {
  type: 'updateMap';
  payload: {
    map: Map;
    worldId: string;
    communityId?: string;
  };
};

export default UpdateMapCommand;
