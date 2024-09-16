import { useModel } from '@modern-js/runtime/model';
import { FC } from 'react';
import { Marker } from 'react-leaflet';
import L, { Point } from 'leaflet';
import TargetSvg from '@shared/svg/target-circular-dot.svg';
import { EngineDataModel } from '../state/engineData';

const GhostTargetMarker: FC = () => {
  const [targetPosition] = useModel(
    EngineDataModel,
    m => m.runtime.ghostTargetPosition,
  );

  const targetIcon = L.icon({
    iconUrl: TargetSvg,
    iconSize: [32, 32],
    iconAnchor: new Point(16, 16),
  });

  return targetPosition ? (
    <Marker icon={targetIcon} position={targetPosition} riseOnHover={true} />
  ) : null;
};

export default GhostTargetMarker;
