import { FC, useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import Timer from '@shared/svg/timer.svg';
import { useModel } from '@modern-js/runtime/model';
import { Countdown } from '@shared/_types';
import { InputText } from 'primereact/inputtext';
import useWebSocket from 'react-use-websocket';
import { v7 } from 'uuid';
import SidePanelRow from '../panels/side-panel/row';
import { StagedPointMarkerModel } from '../imagimapper/state/stagedPointMarker';
import { TimerModel } from '../imagimapper/state/timers';
import DeleteButton from '../buttons/delete-button';
import { EngineDataModel } from '../imagimapper/state/engineData';
import { EditIconButton, SaveIconButton } from '@/components/icon/buttons';
import { useRemoteBackends } from '@/hooks/remoteBackends';

import './countdown.scss';

type CountdownTimerProps = {
  countdown?: Countdown;
  isEditing?: boolean;
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

const CountdownTimer: FC<CountdownTimerProps> = ({ countdown, isEditing }) => {
  const { mapApiHost } = useRemoteBackends();
  const [{ map }] = useModel(EngineDataModel);
  const { sendJsonMessage } = useWebSocket(
    `ws://${mapApiHost}/api/map/${map.id}/ws`,
    {
      share: true,
    },
  );
  const [{ markerId }, actions] = useModel(
    StagedPointMarkerModel,
    TimerModel,
    m => ({
      markerId: m.id,
    }),
  );
  const [maxHours, setMaxHours] = useState(
    toHours(countdown?.totalCountdownSeconds || 0),
  );
  const [maxMinutes, setMaxMinutes] = useState(
    toMinutes(countdown?.totalCountdownSeconds || 0),
  );
  const [maxSeconds, setMaxSeconds] = useState(
    toSeconds(countdown?.totalCountdownSeconds || 0),
  );
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
  const [timerName, setTimerName] = useState(name);

  useEffect(() => {
    setTimerName(name);
  }, [name]);

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

  useEffect(() => {
    console.log('[Countdown] Edit Mode', countdown?.name, isEditing);
  }, [isEditing, countdown]);

  if (!countdown) {
    return (
      <div
        className="countdown-timer add-timer"
        onClick={() => {
          if (!markerId || markerId === '') {
            console.error('No marker ID found');
            return;
          }
          const timerId = v7();
          actions.createAndAddTimer(markerId, timerId);
          console.log('[Countdown] Creating new timer', markerId, timerId);
          sendJsonMessage({
            type: 'CREATE_TIMER',
            payload: {
              markerId,
              timerId,
            },
          });
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
            {isEditing ? (
              <InputText
                value={timerName}
                type="text"
                onChange={e => {
                  if (countdown) {
                    setTimerName(e.target.value);
                  }
                }}
              />
            ) : (
              <h5>{countdown.name ?? 'Timer'}</h5>
            )}
          </div>
          <div className="timer-body">
            <div className="time-segments">
              {isEditing && (
                <>
                  <InputText
                    id="hours-input"
                    className="number-input-2digit"
                    type="number"
                    value={maxHours.toString()}
                    onChange={e => {
                      let value = parseInt(e.target.value, 10);
                      if (isNaN(value) || value < 0) {
                        value = 0;
                      } else if (value > 99) {
                        value = 99;
                      }
                      setMaxHours(value);
                    }}
                  />
                  <label aria-labelledby="hours-input">h</label>
                  <InputText
                    id="minutes-input"
                    className="number-input-2digit"
                    type="number"
                    value={maxMinutes.toString()}
                    onChange={e => {
                      let value = parseInt(e.target.value, 10);
                      if (isNaN(value) || value < 0) {
                        value = 0;
                      } else if (value > 59) {
                        value = 59;
                      }
                      setMaxMinutes(value);
                    }}
                  />
                  <label aria-labelledby="minutes-input">m</label>
                  <InputText
                    id="seconds-input"
                    className="number-input-2digit"
                    type="number"
                    value={maxSeconds.toString()}
                    onChange={e => {
                      let value = parseInt(e.target.value, 10);
                      if (isNaN(value) || value < 0) {
                        value = 0;
                      } else if (value > 59) {
                        value = 59;
                      }
                      setMaxSeconds(value);
                    }}
                  />
                  <label aria-labelledby="seconds-input">s</label>
                </>
              )}
              {!isEditing && (
                <>
                  <p>{hours}h</p>
                  <p>{minutes}m</p>
                  <p>{seconds}s</p>
                </>
              )}
            </div>
            {!isEditing && (
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
                          actions.resumeTimer(markerId, countdown);
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
            )}
          </div>
          <div className="timer-options">
            <input
              type="checkbox"
              id="timer-alert"
              checked={countdown?.alarm}
              onChange={e => {
                if (countdown) {
                  countdown.alarm = e.target.checked;
                  console.log(
                    '[Countdown] Alarm changed',
                    countdown.alarm,
                    e.target.checked,
                  );
                }
              }}
            />
            <label htmlFor="timer-alert">Alert</label>
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
            <label htmlFor="auto-repeat">Auto Repeat</label>
          </div>
        </div>
      }
      controls={
        <div className="controls">
          {isEditing && (
            <SaveIconButton
              onClick={() => {
                if (markerId && countdown) {
                  const updatedCountdown: Countdown = {
                    ...countdown,
                    totalCountdownSeconds:
                      maxHours * 3600 + maxMinutes * 60 + maxSeconds,
                    timeRemainingSeconds:
                      maxHours * 3600 + maxMinutes * 60 + maxSeconds,
                    name: timerName,
                    autoRepeat: countdown.autoRepeat,
                  };
                  console.log(
                    '[Countdown] Saving timer',
                    markerId,
                    countdown,
                    updatedCountdown,
                  );
                  actions.setTimerEditMode(markerId, countdown, false);
                  actions.updateTimer(markerId, updatedCountdown);
                  sendJsonMessage({
                    type: 'UPDATE_TIMER',
                    payload: {
                      markerId,
                      countdown: { ...updatedCountdown },
                    },
                  });
                  console.log(
                    '[Countdown] Update Timer message sent',
                    markerId,
                    updatedCountdown,
                  );
                }
              }}
            />
          )}
          {!isEditing && (
            <EditIconButton
              onClick={() => {
                if (markerId && countdown) {
                  actions.setTimerEditMode(markerId, countdown, true);
                }
              }}
            />
          )}
          <DeleteButton
            onClick={() => {
              if (markerId && countdown) {
                actions.deleteTimer(markerId, countdown);
                sendJsonMessage({
                  type: 'DELETE_TIMER',
                  payload: {
                    markerId,
                    timerId: countdown.id,
                  },
                });
              }
            }}
          />
        </div>
      }
    />
  );
};

export default CountdownTimer;
