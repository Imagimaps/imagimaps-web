import { User } from './types/user';

export type WorldSpace = number;
export type Scalar = number;
export type WorldSpaceCoords = {
  x: WorldSpace;
  y: WorldSpace;
};
export type WorldSpaceSize = {
  width: WorldSpace;
  height: WorldSpace;
};

export type MapMarker = {
  id: string;
  type: 'Marker';
  name: string;
  description: string;
  position: {
    x: number;
    y: number;
  };
  refTemplateid: string;
};

export type MarkerGroup = {
  id: string;
  type: 'MarkerGroup';
  name: string;
  description: string;
  icon?: string;
  markers: MapMarker[];
};

export type MapRegion = {
  id: string;
  type: 'Region';
  name: string;
  description: string;
  points: {
    x: number;
    y: number;
  }[];
  refTemplateid: string;
};

export type Overlay = {
  id: string;
  type: 'Overlay';
  name: string;
  description: string;
  icon?: string;
  markers: MapMarker[];
  markerGroups: MarkerGroup[];
  regions: MapRegion[];
};

export type MapTopography = {
  position: WorldSpaceCoords;
  bounds: {
    top: WorldSpace;
    left: WorldSpace;
    bottom: WorldSpace;
    right: WorldSpace;
  };
  scale: {
    x: Scalar;
    y: Scalar;
  };
};

export type DisplayTemplate = {
  id: string;
  name: string;
  description: string;
  imgSrc: string;
  imgAnchor?: { x: Scalar; y: Scalar }; // Normalised point within image
  targetSize: Size<Pixel>;
  minSize: Size<Pixel>;
  maxSize: Size<Pixel>;
  data: {
    fillColor: string;
    lineColor: string;
    lineWidth: number;
  };
};

export type TemplateGroup = {
  id: string;
  name: string;
  description: string;
  templates: DisplayTemplate[];
};

export enum LayerStatus {
  PROCESSING = 'PROCESSING',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  LOCKED = 'LOCKED',
  ERROR = 'ERROR',
}

export type MapLayer = {
  id: string;
  type: 'Layer';
  name: string;
  status: LayerStatus;
  imagePath: string;
  topography: MapTopography;
  description?: string;
  icon?: string;
  previewImage?: string;
  overlays?: Overlay[];
  active?: boolean;
};

export type Map = {
  id: string;
  type: 'Map';
  name: string;
  description: string;
  boundingTopography: MapTopography;
  icon?: string;
  splashImage?: string;
  owner?: User | string;
  layers: MapLayer[];
  templateGroups?: TemplateGroup[];
  active?: boolean;
};

export type UserMapMetadata = {
  layerId: string;
  position: WorldSpaceCoords;
  zoom: number;
};

export type MapMetadata = {
  viewPosition: WorldSpaceCoords;
  viewZoom: number;
  activeLayer?: MapLayer;
};
