import { FC, useEffect, useState } from 'react';
import { TileLayer } from 'react-leaflet';
import { LatLngBounds } from 'leaflet';

import { useModel } from '@modern-js/runtime/model';
import { MapDataModel } from './mapDataModel';

// interface BackgroundLayerProps {
//   src: string;
//   size: WorldSpaceSize;
//   offset: WorldSpaceCoords;
// }

const BackgroundLayer: FC = () => {
  const [map] = useModel(MapDataModel);

  const [imgSrc, setImgSrc] = useState<string | undefined>();
  const [bounds, setBounds] = useState<LatLngBounds | undefined>();

  useEffect(() => {
    const topology = map.activeTopology;
    const { baseImageSrc, bounds } = topology;
    const yxBounds = new LatLngBounds(
      [bounds.top, bounds.left],
      [bounds.bottom, bounds.right],
    );
    setImgSrc(baseImageSrc);
    setBounds(yxBounds);
    console.log('BGSrc: ', baseImageSrc);
  }, [map.activeTopology]);

  return imgSrc && bounds ? (
    <>
      {/* <ImageOverlay url={imgSrc} bounds={bounds} opacity={0.3} /> */}
      <TileLayer
        url="http://localhost:8082/map/tile/{z}/{x}/{y}"
        bounds={bounds}
        tms={false}
        opacity={0.3}
      />
    </>
  ) : null;
};

export default BackgroundLayer;
