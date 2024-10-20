import { useModel } from '@modern-js/runtime/model';
import { FC } from 'react';
import { Marker } from 'react-leaflet';
import L, { Point } from 'leaflet';
import TargetSvg from '@shared/svg/target-circular-dot.svg';
// import { UserInteractionsModel } from '../state/userInteractions';
import { StagedPointMarkerModel } from '../state/stagedPointMarker';
import { xy } from '../_coordTranslators';

const GhostTargetMarker: FC = () => {
  // const [targetPosition] = useModel(
  //   UserInteractionsModel,
  //   m => m.ghostTargetPosition,
  // );
  const [{ positionChanged, ghostPos }] = useModel(
    StagedPointMarkerModel,
    s => ({
      positionChanged: s.positionChanged,
      ghostPos: s._position?.[2],
    }),
  );

  const targetIcon = L.icon({
    iconUrl: TargetSvg,
    iconSize: [32, 32],
    iconAnchor: new Point(16, 16),
  });

  return positionChanged && ghostPos ? (
    <Marker
      icon={targetIcon}
      position={xy(ghostPos.x, ghostPos.y)}
      riseOnHover={true}
    />
  ) : null;
};

export default GhostTargetMarker;
