export type WorldSpace = number;
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

export type MapOverlay = {
  id: string;
  type: 'Overlay';
  name: string;
  description: string;
  markers: MapMarker[];
  regions: MapRegion[];
};

export type MapTopology = {
  id: string;
  name: string;
  description: string;
  position: WorldSpaceCoords;
  bounds: {
    top: WorldSpace;
    left: WorldSpace;
    bottom: WorldSpace;
    right: WorldSpace;
  };
  baseImageSrc: string;
  overlays: MapOverlay[];
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

export type Map = {
  id: string;
  name: string;
  description: string;
  topology: MapTopology;
  templateGroups: TemplateGroup[];
  originOffset: WorldSpaceCoords;
};

export type MapMetadata = {
  activeTopologyId: string;
  viewPosition: WorldSpaceCoords;
  viewZoom: number;
};
