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

// const COMMUNITY_ID = '0';
// const WORLD_ID = '0';
// const MAP_ID = '0';
// const LAYER_ID = '0';

const BackgroundLayer: FC = () => {
  const { hostname } = window.location;

  const [map] = useModel(MapDataModel);

  const [mapTileCDNHost, setMapApiHost] = useState<string>(
    'http://localhost:8082',
  );
  const [bounds, setBounds] = useState<LatLngBounds | undefined>();

  useEffect(() => {
    // if (hostname === 'localhost') {
    //   setMapApiHost('http://localhost:8082');
    // } else {
    //   setMapApiHost(`https://cdn.${hostname}`);
    // }
    setMapApiHost('https://cdn.dev.imagimaps.com');
  }, [hostname]);

  useEffect(() => {
    const topology = map.activeLayer?.topography;
    if (topology) {
      const { bounds } = topology;
      const yxBounds = new LatLngBounds(
        [bounds.top, bounds.left],
        [bounds.bottom, bounds.right],
      );
      setBounds(yxBounds);
    }
  }, [map.activeLayer]);

  console.log('BackgroundLayer', map.activeLayer, bounds);
  return map.activeLayer && bounds ? (
    <>
      {/* <ImageOverlay url={imgSrc} bounds={bounds} opacity={0.3} /> */}
      <TileLayer
        // url={`${mapTileCDNHost}/${COMMUNITY_ID}/${WORLD_ID}/${MAP_ID}/${LAYER_ID}/{z}_{x}_{y}.png`}
        url={`${mapTileCDNHost}/${map.activeLayer.imagePath}/{z}_{x}_{y}.png`}
        bounds={bounds}
        tms={false}
        opacity={0.3}
      />
    </>
  ) : null;
};

export default BackgroundLayer;
