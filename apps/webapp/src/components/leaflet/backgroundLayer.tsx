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
  const { hostname } = window.location;

  const [map] = useModel(MapDataModel);

  const [mapApiHost, setMapApiHost] = useState<string>('http://localhost:8082');
  const [imgSrc, setImgSrc] = useState<string | undefined>();
  const [bounds, setBounds] = useState<LatLngBounds | undefined>();

  useEffect(() => {
    if (hostname === 'localhost') {
      setMapApiHost('http://localhost:8082');
    } else {
      setMapApiHost(`https://${hostname}`);
    }
  }, [hostname]);

  useEffect(() => {
    const topology = map.activeTopology;
    const { baseImageSrc, bounds } = topology;
    const yxBounds = new LatLngBounds(
      [bounds.top, bounds.left],
      [bounds.bottom, bounds.right],
    );
    setImgSrc(baseImageSrc);
    setBounds(yxBounds);
  }, [map.activeTopology]);

  return imgSrc && bounds ? (
    <>
      {/* <ImageOverlay url={imgSrc} bounds={bounds} opacity={0.3} /> */}
      <TileLayer
        url={`${mapApiHost}/api/map/tile/{z}/{x}/{y}.png`}
        bounds={bounds}
        tms={false}
        opacity={0.3}
      />
    </>
  ) : null;
};

export default BackgroundLayer;
