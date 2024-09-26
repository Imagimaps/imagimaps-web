import { FC, useEffect, useState } from 'react';
import { LatLngBounds } from 'leaflet';
import { TileLayer } from 'react-leaflet';
import { useModel } from '@modern-js/runtime/model';
import { EngineDataModel } from './state/engineData';
import { useRemoteBackends } from '@/hooks/remoteBackends';

const BackgroundTiledImages: FC = () => {
  const { cdnBaseUrl } = useRemoteBackends();
  const [{ activeLayer }] = useModel(EngineDataModel);
  const [bounds, setBounds] = useState<LatLngBounds | undefined>();

  // TODO: Logic to load cdnHost for the environment

  useEffect(() => {
    console.log('activeLayer loaded:', activeLayer);
    const topology = activeLayer?.topography;
    if (topology) {
      const { bounds } = topology;
      console.log('bounds:', bounds);
      const yxBounds = new LatLngBounds(
        [bounds.top, bounds.left],
        [bounds.bottom, bounds.right],
      );
      setBounds(yxBounds);
    }
  }, [activeLayer]);

  return (
    activeLayer && (
      <TileLayer
        url={`${cdnBaseUrl}/${activeLayer.imagePath}/{z}_{x}_{y}.png`}
        bounds={bounds}
        tms={false}
        detectRetina={true}
      />
    )
  );
};

export default BackgroundTiledImages;