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

export type MapLayer = {
  id: string;
  name: string;
  description?: string;
  owner?: string;
  icon?: string;
  parameters: MapLayerParameters;
  markers: MapMarker[];
};

export type MapLayerParameters = {
  position: {
    x: number;
    y: number;
  };
  scale: {
    x: number;
    y: number;
  };
};
