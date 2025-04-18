import { model } from '@modern-js/runtime/model';
import { Countdown, Map as UserMap } from '@shared/_types';
import { DefaultCountdown } from '@shared/_defaults';
import { StagedPointMarkerModel } from './stagedPointMarker';

type MarkerId = string;
type IsEditing = boolean;

type TimerUIState = {
  isEditing: boolean;
};
type TimersState = {
  timers: Map<MarkerId, { countdown: Countdown; uiState: TimerUIState }[]>;
  // selectedMarkerId?: string;
};

const TimerDefaults = {
  timers: new Map<MarkerId, Countdown>(),
};

const findTimer = (
  timers: { countdown: Countdown; uiState: TimerUIState }[],
  markerId: string,
  countdown: Countdown,
) => {
  if (!timers || timers.length === 0) {
    console.error('[TimerModel] No timers found for markerId', markerId);
    return undefined;
  }
  const timer = timers.find(t => t.countdown.id === countdown.id);
  if (!timer) {
    console.error('[TimerModel] Timer not found', countdown.id);
    return undefined;
  }
  return timer;
};

export const TimerModel = model<TimersState>('timer').define(_ => {
  return {
    state: TimerDefaults,
    computed: {
      markerTimers: [
        StagedPointMarkerModel,
        (state: TimersState, marker) => {
          if (marker.id) {
            return state.timers.get(marker.id);
          }
          return undefined;
        },
      ],
    },
    actions: {
      initFromMapData: (state: TimersState, map: UserMap) => {
        console.log('[TimerModel] Initialising Timers', map);
        const layers = map.layers ?? [];
        layers.forEach(layer => {
          const overlays = layer.overlays ?? [];
          overlays.forEach(overlay => {
            const markers = overlay.markers ?? [];
            markers.forEach(marker => {
              const countdownTimers = marker.countdowns ?? [];
              if (countdownTimers.length > 0) {
                const markerId = marker.id;
                console.log(
                  '[TimerModel] Adding Existing Timers for MarkerId',
                  markerId,
                  countdownTimers,
                );
                const timersState = countdownTimers.map(timer => ({
                  countdown: timer,
                  uiState: {
                    isEditing: false,
                  },
                }));
                state.timers.set(markerId, timersState);
              }
            });
          });
        });
      },
      remoteTimerCreated(
        state: TimersState,
        markerId: string,
        countdown: Countdown,
      ) {
        const timers = state.timers.get(markerId);
        if (!timers) {
          console.error('[TimerModel] No timers found for markerId', markerId);
          return;
        }
        console.log(
          '[TimerModel][WS] Remote Timer Created',
          countdown.id,
          timers.map(t => t.countdown.id),
        );
        const timer = timers.find(t => t.countdown.id === countdown.id);
        if (timer) {
          timer.countdown = countdown;
          state.timers.set(markerId, timers);
          console.log(
            '[TimerModel][WS] Local Existing Timer Updated Remotely',
            timer,
          );
          return;
        }
        const newTimer = {
          countdown,
          uiState: {
            isEditing: false,
          },
        };
        state.timers.set(markerId, [...timers, newTimer]);
        console.log(
          '[TimerModel][WS] Created New Timer',
          newTimer,
          timers,
          state.timers,
        );
      },
      remoteTimerUpdated(
        state: TimersState,
        markerId: string,
        countdown: Countdown,
      ) {
        const timers = state.timers.get(markerId);
        if (!timers) {
          console.error('[TimerModel] No timers found for markerId', markerId);
          return;
        }
        const timer = timers.find(t => t.countdown.id === countdown.id);
        if (!timer) {
          console.error('[TimerModel] Timer not found', countdown.id);
          return;
        }
        timer.countdown = countdown;
        const updatedTimers = timers.map(t => {
          if (t.countdown.id === countdown.id) {
            return timer;
          }
          return t;
        });
        state.timers.set(markerId, updatedTimers);
      },
      remoteTimerDeleted(
        state: TimersState,
        markerId: string,
        countdownId: string,
      ) {
        const timers = state.timers.get(markerId);
        if (!timers) {
          console.error('[TimerModel] No timers found for markerId', markerId);
          return;
        }
        const timer = timers.find(t => t.countdown.id === countdownId);
        if (!timer) {
          console.error('[TimerModel] Timer not found', countdownId);
          return;
        }
        const updatedTimers = timers.filter(
          t => t.countdown.id !== countdownId,
        );
        state.timers.set(markerId, updatedTimers);
      },
      createAndAddTimer: (
        state: TimersState,
        markerId: string,
        timerId: string,
      ) => {
        let timers = state.timers.get(markerId);
        const numberOfTimers = timers?.length;
        if (!timers || numberOfTimers === 0) {
          timers = [
            {
              countdown: DefaultCountdown('Timer', 0, timerId),
              uiState: { isEditing: true },
            },
          ];
          console.log(
            '[TimerModel] Initialised and Created First Timer',
            timers,
          );
          state.timers.set(markerId, timers);
          return;
        }
        const newTimer = DefaultCountdown(
          `Timer ${(numberOfTimers ?? 0) + 1}`,
          numberOfTimers ?? 0,
          timerId,
        );
        console.log('[TimerModel] Created New Timer', newTimer, [...timers]);
        state.timers.set(markerId, [
          ...timers,
          { countdown: newTimer, uiState: { isEditing: true } },
        ]);
      },
      startTimer: (state, markerId: string, countdown: Countdown) => {
        const timers = state.timers.get(markerId) ?? [];
        const timer = findTimer(timers, markerId, countdown);
        if (!timer) {
          console.error(
            '[TimerModel] No running timer found for markerId',
            markerId,
          );
          return;
        }
        timer.countdown.isRunning = true;
        timer.countdown.isPaused = false;
        timer.countdown.startTime = new Date();
        timer.countdown.pauseTime = undefined;
        timer.countdown.timeRemainingSeconds =
          timer.countdown.totalCountdownSeconds;

        const updatedTimers = timers.map(t => {
          if (t.countdown.id === countdown.id) {
            return timer;
          }
          return t;
        });
        state.timers.set(markerId, updatedTimers);
      },
      pauseTimer: (state, markerId: string, countdown: Countdown) => {
        const timers = state.timers.get(markerId) ?? [];
        const timer = findTimer(timers, markerId, countdown);
        if (!timer) {
          console.error(
            '[TimerModel] No running timer found for markerId',
            markerId,
          );
          return;
        }
        timer.countdown.isRunning = true;
        timer.countdown.isPaused = true;
        timer.countdown.pauseTime = new Date();
        const updatedTimers = timers.map(t => {
          if (t.countdown.id === timer.countdown.id) {
            return timer;
          }
          return t;
        });
        state.timers.set(markerId, updatedTimers);
      },
      resumeTimer: (state, markerId: string, countdown: Countdown) => {
        const timers = state.timers.get(markerId) ?? [];
        const timer = findTimer(timers, markerId, countdown);
        if (!timer) {
          console.error(
            '[TimerModel] No running timer found for markerId',
            markerId,
          );
          return;
        }
        timer.countdown.isRunning = true;
        timer.countdown.isPaused = false;
        const updatedTimers = timers.map(t => {
          if (t.countdown.id === timer.countdown.id) {
            return timer;
          }
          return t;
        });
        state.timers.set(markerId, updatedTimers);
      },
      tickTimer: (
        state,
        markerId: string,
        countdown: Countdown,
        tickValueSeconds: number,
      ) => {
        const timers = state.timers.get(markerId) ?? [];
        const timer = findTimer(timers, markerId, countdown);
        if (!timer) {
          console.error(
            '[TimerModel] No running timer found for markerId',
            markerId,
          );
          return;
        }
        if (timer.countdown.isPaused) {
          console.error('[TimerModel] Timer is paused', timer);
          return;
        }
        if (timer.countdown.isRunning) {
          timer.countdown.timeRemainingSeconds -= tickValueSeconds;
          if (timer.countdown.timeRemainingSeconds <= 0) {
            timer.countdown.timeRemainingSeconds = 0;
            timer.countdown.isRunning = false;
            timer.countdown.isPaused = false;
            timer.countdown.startTime = undefined;
            timer.countdown.pauseTime = undefined;

            console.log('[TimerModel] Timer has ended', timer);
          }
        }
        const updatedTimers = timers.map(t => {
          if (t.countdown.id === timer.countdown.id) {
            return timer;
          }
          return t;
        });
        state.timers.set(markerId, updatedTimers);
      },
      resetTimer: (state, markerId: string, countdown: Countdown) => {
        const timers = state.timers.get(markerId) ?? [];
        const timer = findTimer(timers, markerId, countdown);
        if (!timer) {
          console.error(
            '[TimerModel] No running timer found for markerId',
            markerId,
          );
          return;
        }
        timer.countdown.isRunning = false;
        timer.countdown.isPaused = false;
        timer.countdown.startTime = undefined;
        timer.countdown.pauseTime = undefined;
        timer.countdown.timeRemainingSeconds =
          timer.countdown.totalCountdownSeconds;

        const updatedTimers = timers.map(t => {
          if (t.countdown.id === timer.countdown.id) {
            return timer;
          }
          return t;
        });
        console.log('[TimerModel] Reset Timer', timer.countdown.name);
        state.timers.set(markerId, updatedTimers);
      },
      setTimerEditMode: (
        state,
        markerId: string,
        countdown: Countdown,
        isEditing: IsEditing,
      ) => {
        const timers = state.timers.get(markerId) ?? [];
        const timer = findTimer(timers, markerId, countdown);
        if (!timer) {
          console.error(
            '[TimerModel] No running timer found for markerId',
            markerId,
          );
          return;
        }
        const updatedTimers = timers.map(t => {
          if (t.countdown.id === timer.countdown.id) {
            return {
              countdown: {
                ...timer.countdown,
              },
              uiState: {
                isEditing,
              },
            };
          }
          return t;
        });
        state.timers.set(markerId, updatedTimers);
      },
      updateTimer: (state, markerId: string, countdown: Countdown) => {
        const timers = state.timers.get(markerId) ?? [];
        const timer = findTimer(timers, markerId, countdown);
        if (!timer) {
          console.error(
            '[TimerModel] No running timer found for markerId',
            markerId,
          );
          return;
        }
        const updatedTimers = timers.map(t => {
          if (t.countdown.id === timer.countdown.id) {
            return {
              countdown: {
                ...timer.countdown,
                ...countdown,
              },
              uiState: {
                isEditing: false,
              },
            };
          }
          return t;
        });
        state.timers.set(markerId, updatedTimers);
      },
      deleteTimer: (state, markerId: string, countdown: Countdown) => {
        const timers = state.timers.get(markerId) ?? [];
        const timer = findTimer(timers, markerId, countdown);
        if (!timer) {
          console.error(
            '[TimerModel] No running timer found for markerId',
            markerId,
          );
          return;
        }
        const updatedTimers = timers.filter(
          t => t.countdown.id !== timer.countdown.id,
        );
        state.timers.set(markerId, updatedTimers);
      },
    },
  };
});
