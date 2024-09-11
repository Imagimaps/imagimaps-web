import type { MapLayer } from '@shared/types/map';
import { TreeNode } from './types';

export const MapLayerToTreeNode = (layer: MapLayer): TreeNode => {
  return {
    id: layer.id,
    name: layer.name,
    type: 'layer',
    children: layer.markers?.map(marker => ({
      id: marker.id,
      name: marker.name,
      type: 'marker',
    })),
  };
};
