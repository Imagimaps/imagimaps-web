import { useModel } from '@modern-js/runtime/model';
import { FC } from 'react';
import { Marker } from 'react-leaflet';
import { MapRuntimeModel } from './mapRuntimeModel';
import { xy } from './mapView';

const StagedMarker: FC = () => {
  const [marker] = useModel(MapRuntimeModel, m => m.stagedMarker);

  return marker?.position ? (
    <Marker
      position={xy(marker.position.x, marker.position.y)}
      riseOnHover={true}
    />
  ) : null;
};

export default StagedMarker;
