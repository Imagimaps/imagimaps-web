import { FC } from 'react';
import { useModel } from '@modern-js/runtime/model';
import { Marker } from 'react-leaflet';

import { StagedPolygonModel } from '../state/stagedPolygon';
import { xy } from '../_coordTranslators';

const StagedPolygon: FC = () => {
  const [{ points }] = useModel(StagedPolygonModel);

  return (
    <>
      {points.map(point => (
        <Marker key={point.id} position={xy(point.x, point.y)} />
      ))}
    </>
  );
};

export default StagedPolygon;
