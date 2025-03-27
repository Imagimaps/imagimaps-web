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

export type Owner = {
  type: 'user' | 'community';
  displayId: string;
  id?: string;
  name?: string;
  icon?: string;
};

export type MarkerType = 'Marker' | 'Region';

export type MapMarker = {
  id: string;
  type: 'Marker';
  name: string;
  description: string;
  position: {
    x: number;
    y: number;
  };
  templateId: string;
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
  templateId: string;
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
  iconLink?: string;
  iconData?: string;
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
  markerTemplates: DisplayTemplate[];
};

export enum LayerStatus {
  NEW = 'NEW',
  DRAFT = 'DRAFT',
  PROCESSING = 'PROCESSING',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  LOCKED = 'LOCKED',
  ERROR = 'ERROR',
}

export type MapLayer = {
  type: 'Layer';
  id: string;
  name: string;
  status: LayerStatus;
  isDefault?: boolean;
  createdDate: Date;
  updatedDate: Date;
  imagePath: string;
  originalImagePath: string;
  thumbnailPath: string;
  order: number;
  description?: string;
  icon?: string;
  previewImage?: string;
  overlays?: Overlay[];
  topography: MapTopography;
  active?: boolean;
};

export type MapIntrinsics = {
  name: string;
  description: string;
  icon?: string;
  splashImage?: string;
};

export enum MapShared {
  Public = 'public',
  Private = 'private',
  Unlisted = 'unlisted',
}

export type Map = {
  id: string;
  type: 'Map';
  intrinsics: MapIntrinsics;
  owner?: Owner;
  shared: MapShared;
  layers: MapLayer[];
  templateGroups?: TemplateGroup[];
  boundingTopography?: MapTopography;
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
