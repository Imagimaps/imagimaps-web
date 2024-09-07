export type MapApiContext = {
  communityId?: string;
  worldId?: string;
  mapId?: string;
  mapLayerId?: string;
};

export type Map = {
  id: string;
  name: string;
  description?: string;
  owner?: string;
  icon?: string;
  layers: MapLayer[];
  viewing: boolean;
};
