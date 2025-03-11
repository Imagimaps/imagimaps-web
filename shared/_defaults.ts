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
    id: '',
    type: 'Layer',
    name: `New Layer ${layerOrder}`,
    description: 'Edit the fields here to customize this layer',
    order: layerOrder,
    status: LayerStatus.DRAFT,
    imagePath: '',
    topography: {
      position: { x: 0, y: 0 },
      bounds: { top: 0, left: 0, bottom: 0, right: 0 },
      scale: { x: 1, y: 1 },
    },
    isDefault: false,
  };
};
