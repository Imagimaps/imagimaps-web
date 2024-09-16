import L from 'leaflet';

export const yx = L.latLng;

export const xy = (x: number, y: number) => {
  if (Array.isArray(x)) {
    // When doing xy([x, y]);
    return yx(x[1], x[0]);
  }
  return yx(y, x); // When doing xy(x, y);
};
