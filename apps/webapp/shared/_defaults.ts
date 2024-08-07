import { Map } from './_types';

const DefaultMap: Map = {
  id: 'default',
  name: 'Default Map',
  description: 'Default Map',
  topology: {
    id: 'default',
    name: 'Default Topology',
    description: 'Default Topology',
    position: { x: 0, y: 0 },
    bounds: { top: 0, left: 0, bottom: 0, right: 0 },
    baseImageSrc: '',
    overlays: [],
  },
  templateGroups: [],
  originOffset: { x: 0, y: 0 },
};

export { DefaultMap };
