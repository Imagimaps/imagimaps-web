import { v7 } from 'uuid';
import { Countdown, LayerStatus, Map, MapLayer, MapShared } from './_types';

export const DefaultMap: Map = {
  type: 'Map',
  id: 'default',
  intrinsics: {
    name: 'Default Map',
    description: 'Default Map',
  },
  shared: MapShared.Private,
  boundingTopography: {
    position: { x: 0, y: 0 },
    bounds: { top: 0, left: 0, bottom: 0, right: 0 },
    scale: { x: 1, y: 1 },
  },
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

export const DefaultCountdown = (name: string, position: number): Countdown => {
  return {
    id: v7(),
    name,
    position,
    totalCountdownSeconds: 20 * 60, // 20 minutes in seconds
    timeRemainingSeconds: 20 * 60, // 20 minutes in seconds
    autoRepeat: false,
    startTime: undefined,
    pauseTime: undefined,
    isPaused: false,
    isRunning: false,
  };
};
