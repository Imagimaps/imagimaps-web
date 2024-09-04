import { useModel } from '@modern-js/runtime/model';
import { FC } from 'react';
import { Marker } from 'react-leaflet';
import L, { Point } from 'leaflet';
import TargetSvg from '@shared/svg/target-circular-dot.svg';
import { MapRuntimeModel } from './mapRuntimeModel';

const GhostTargetMarker: FC = () => {
  const [targetPosition] = useModel(
    MapRuntimeModel,
    m => m.ghostTargetPosition,
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
