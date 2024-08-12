export default async (
  worldId: string,
  mapId: string,
  z: number,
  x: number,
  y: number,
) => {
  console.log(`Getting tile for ${worldId}/${mapId}/${z}/${x}/${y}`);

  return `data:image/png;base64,`;
};
