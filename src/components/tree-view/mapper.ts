import { MapLayer } from '@shared/_types';
import { TreeNode } from './types';

export const MapLayerToTreeNode = (layer: MapLayer): TreeNode => {
  return {
    id: layer.id,
    name: layer.name,
    type: 'layer',
    children: layer.overlays?.map(overlay => ({
      id: overlay.id,
      name: overlay.name,
      type: 'overlay',
    })),
  };
};
