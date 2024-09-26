import { FC, useEffect, useState } from 'react';
import { TileLayer } from 'react-leaflet';
import { LatLngBounds } from 'leaflet';

import { useModel } from '@modern-js/runtime/model';
import { MapDataModel } from './mapDataModel';
import { useRemoteBackends } from '@/hooks/remoteBackends';

const BackgroundLayer: FC = () => {
  const { cdnBaseUrl } = useRemoteBackends();
  const [map] = useModel(MapDataModel);
  const [bounds, setBounds] = useState<LatLngBounds | undefined>();

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
      <TileLayer
        url={`${cdnBaseUrl}/${map.activeLayer.imagePath}/{z}_{x}_{y}.png`}
        bounds={bounds}
        tms={false}
        opacity={0.3}
      />
    </>
  ) : null;
};

export default BackgroundLayer;
