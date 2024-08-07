import NodeCache from 'node-cache';

export const TileCache = new NodeCache({
  stdTTL: 60 * 60 * 24 * 7,
  checkperiod: 60 * 60,
  useClones: true,
});

export const ImageCache = new NodeCache({
  stdTTL: 60 * 60 * 24 * 7,
  checkperiod: 60 * 60,
  useClones: true,
});
