import { Map } from './_types';

const DefaultMap: Map = {
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

export { DefaultMap };
