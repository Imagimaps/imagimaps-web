import { useModel } from '@modern-js/runtime/model';
import { FC } from 'react';
import { Marker } from 'react-leaflet';
import { xy } from '../_coordTranslators';
import { EngineDataModel } from '../state/engineData';

const StagedMarker: FC = () => {
  const [marker] = useModel(EngineDataModel, m => m.runtime.stagedMarker);

  return marker?.position ? (
    <Marker
      position={xy(marker.position.x, marker.position.y)}
      riseOnHover={true}
    />
  ) : null;
};

export default StagedMarker;
