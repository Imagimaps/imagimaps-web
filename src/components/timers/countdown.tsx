import { FC, useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import Timer from '@shared/svg/timer.svg';
import { useModel } from '@modern-js/runtime/model';
import { Countdown } from '@shared/_types';
import { InputText } from 'primereact/inputtext';
import SidePanelRow from '../panels/side-panel/row';
import { StagedPointMarkerModel } from '../imagimapper/state/stagedPointMarker';
import { TimerModel } from '../imagimapper/state/timers';
import DeleteButton from '../buttons/delete-button';
import { EditIconButton } from '@/components/icon/buttons';

import './countdown.scss';

type CountdownTimerProps = {
  countdown?: Countdown;
  // startTimer?: () => void;
  // pauseTimer?: () => void;
  // resetTimer?: () => void;
  setEditMode?: (editMode: boolean) => void;
};

const toHours = (seconds: number) => {
  const totalSeconds = Math.floor(seconds);
  return Math.floor(totalSeconds / 3600);
};
const toMinutes = (seconds: number) => {
  const totalSeconds = Math.floor(seconds);
  return Math.floor((totalSeconds % 3600) / 60);
};
const toSeconds = (seconds: number) => {
  const totalSeconds = Math.floor(seconds);
  return Math.floor(totalSeconds % 60);
};

const CountdownTimer: FC<CountdownTimerProps> = ({
  countdown,
  // startTimer,
  // pauseTimer,
  // resetTimer,
  setEditMode,
}) => {
  const [localEdit, setLocalEdit] = useState(false);
  const [{ markerId }, actions] = useModel(
    StagedPointMarkerModel,
    TimerModel,
    m => ({
      markerId: m.id,
    }),
  );
  const [editMode, setEditModeState] = useState(false);
  const [maxHours, setMaxHours] = useState(
    toHours(countdown?.totalCountdownSeconds || 0),
  );
  const [maxMinutes, setMaxMinutes] = useState(
    toMinutes(countdown?.totalCountdownSeconds || 0),
  );
  const [maxSeconds, setMaxSeconds] = useState(
    toSeconds(countdown?.totalCountdownSeconds || 0),
  );
  console.log('[Countdown] Timer', maxHours, maxMinutes, maxSeconds);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const {
    name,
    totalCountdownSeconds,
    timeRemainingSeconds,
    autoRepeat,
    isRunning,
    isPaused,
  } = countdown || {
    name: 'no name',
    totalCountdownSeconds: 0,
    timeRemainingSeconds: 0,
    autoRepeat: false,
    isRunning: false,
    isPaused: false,
  };

  useEffect(() => {
    console.log('[Countdown] Local Edit Value', localEdit);
  }, [localEdit]);

  useEffect(() => {
    // Dealing with Timer Initialisation
    const timerHours = toHours(totalCountdownSeconds);
    const timerMinutes = toMinutes(totalCountdownSeconds);
    const timerSeconds = toSeconds(totalCountdownSeconds);

    if (totalCountdownSeconds) {
      console.log(
        '[Countdown] Setting max time',
        timerHours,
        timerMinutes,
        timerSeconds,
      );
      setMaxHours(timerHours);
      setMaxMinutes(timerMinutes);
      setMaxSeconds(timerSeconds);
    }
  }, [totalCountdownSeconds]);

  useEffect(() => {
    if (timeRemainingSeconds) {
      setHours(toHours(timeRemainingSeconds));
      setMinutes(toMinutes(timeRemainingSeconds));
      setSeconds(toSeconds(timeRemainingSeconds));
      console.log(
        '[Countdown] Timer updated',
        toHours(timeRemainingSeconds),
        toMinutes(timeRemainingSeconds),
        toSeconds(timeRemainingSeconds),
        timeRemainingSeconds,
      );
    }
  }, [timeRemainingSeconds]);

  if (!countdown) {
    return (
      <div
        className="countdown-timer add-timer"
        onClick={() => {
          if (!markerId || markerId === '') {
            console.error('No marker ID found');
            return;
          }
          actions.createAndAddTimer(markerId);
        }}
      >
        + Add Timer
      </div>
    );
  }

  return (
    <SidePanelRow
      className="countdown-timer"
      icon={Timer}
      content={
        <div className="countdown-timer-content">
          <div className="timer-data">
            {localEdit ? (
              <InputText
                value={name}
                onChange={e => {
                  if (countdown) {
                    countdown.name = e.target.value;
                    console.log(
                      '[Countdown] Timer name changed',
                      countdown.name,
                      e.target.value,
                    );
                  }
                }}
                onBlur={() => {
                  setEditModeState(false);
                  if (setEditMode) {
                    setEditMode(false);
                  }
                }}
              />
            ) : (
              <h5>{countdown.name ?? 'Timer'}</h5>
            )}
          </div>
          <div className="timer-body">
            <div className="time-segments">
              <p>{hours}h</p>
              <p>{minutes}m</p>
              <p>{seconds}s</p>
            </div>
            <div className="timer-controls">
              {(isPaused || !isRunning) && (
                <Button
                  onClick={() => {
                    if (markerId && countdown) {
                      console.log(
                        '[Countdown] Starting timer',
                        markerId,
                        countdown,
                      );
                      if (!isRunning) {
                        actions.startTimer(markerId, countdown);
                      } else {
                        actions.unpauseTimer(markerId, countdown);
                      }
                    }
                  }}
                  icon="pi pi-play-circle"
                />
              )}
              {isRunning && !isPaused && (
                <Button
                  onClick={() => {
                    if (markerId && countdown) {
                      console.log(
                        '[Countdown] Pausing timer',
                        markerId,
                        countdown,
                      );
                      actions.pauseTimer(markerId, countdown);
                    }
                  }}
                  icon="pi pi-pause-circle"
                />
              )}
              <Button
                onClick={() => {
                  if (markerId && countdown) {
                    console.log(
                      '[Countdown] Resetting timer',
                      markerId,
                      countdown,
                    );
                    actions.resetTimer(markerId, countdown);
                  }
                }}
                icon="pi pi-replay"
              />
            </div>
          </div>
          <div className="timer-options">
            <div className="auto-repeat">
              <label htmlFor="auto-repeat">Auto Repeat</label>
              <input
                type="checkbox"
                id="auto-repeat"
                checked={autoRepeat}
                onChange={e => {
                  if (countdown) {
                    countdown.autoRepeat = e.target.checked;
                    console.log(
                      '[Countdown] Auto repeat changed',
                      countdown.autoRepeat,
                      e.target.checked,
                    );
                  }
                }}
              />
            </div>
          </div>
        </div>
      }
      controls={
        <div className="controls">
          <EditIconButton
            onClick={() => {
              setEditModeState(!editMode);
              setLocalEdit(!localEdit);
              if (setEditMode) {
                setEditMode(!editMode);
              }
            }}
          />
          <DeleteButton
            onClick={() => {
              if (markerId && countdown) {
                // actions.deleteTimer(markerId, countdown.id);
              }
            }}
          />
        </div>
      }
    />
  );
};

export default CountdownTimer;
