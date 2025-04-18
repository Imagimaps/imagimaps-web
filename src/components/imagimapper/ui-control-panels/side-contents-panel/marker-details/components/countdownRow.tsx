import { FC } from 'react';
import { useModel } from '@modern-js/runtime/model';
import { StagedPointMarkerModel } from '@/components/imagimapper/state/stagedPointMarker';
import { EngineDataModel } from '@/components/imagimapper/state/engineData';
import { TimerModel } from '@/components/imagimapper/state/timers';
import CountdownTimer from '@/components/timers/countdown';

import './styles.scss';

const CountdownRow: FC = () => {
  const [{ markerTimers }] = useModel(
    StagedPointMarkerModel,
    EngineDataModel,
    TimerModel,
    (m, e, t) => ({
      markerId: m.id,
      markerIsNew: m.isNew,
      map: e.map,
      markerTimers: t.markerTimers,
    }),
  );

  return (
    <div>
      {markerTimers?.map((timer, index) => (
        <CountdownTimer
          key={`countdown-timer=${index}`}
          countdown={timer.countdown}
          isEditing={timer.uiState.isEditing}
        />
      ))}
      <CountdownTimer />
    </div>
  );
};

export default CountdownRow;
