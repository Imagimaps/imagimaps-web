import { useModel } from '@modern-js/runtime/model';
import { FC } from 'react';
import { Marker } from 'react-leaflet';
import { xy } from '../_coordTranslators';
import { StagedDataModel } from '../state/stagedData';

const StagedMarker: FC = () => {
  const [{ markerPosition }] = useModel(StagedDataModel, m => ({
    markerPosition: m.position?.[1],
    mapMarker: m.mapMarker,
  }));

  return markerPosition ? (
    <Marker
      position={xy(markerPosition.x, markerPosition.y)}
      riseOnHover={true}
    />
  ) : null;
};

export default StagedMarker;
