import { LayerStatus, Map, MapLayer } from './_types';

export const DefaultMap: Map = {
  id: 'default',
  name: 'Default Map',
  description: 'Default Map',
  boundingTopography: {
    position: { x: 0, y: 0 },
    bounds: { top: 0, left: 0, bottom: 0, right: 0 },
    scale: { x: 1, y: 1 },
  },
  type: 'Map',
  layers: [],
};

export const NewLayer = (layerOrder: number): MapLayer => {
  return {
    type: 'Layer',
    id: '',
    name: `New Layer ${layerOrder}`,
    status: LayerStatus.DRAFT,
    isDefault: false,
    createdDate: new Date(),
    updatedDate: new Date(),
    imagePath: '',
    originalImagePath: '',
    thumbnailPath: '',
    order: layerOrder,
    description: 'Edit the fields here to customize this layer',
    topography: {
      position: { x: 0, y: 0 },
      bounds: { top: 0, left: 0, bottom: 0, right: 0 },
      scale: { x: 1, y: 1 },
    },
  };
};
