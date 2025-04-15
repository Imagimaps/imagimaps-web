import { model } from '@modern-js/runtime/model';
import { Countdown } from '@shared/_types';
import { DefaultCountdown } from '@shared/_defaults';
import { StagedPointMarkerModel } from './stagedPointMarker';

type MarkerId = string;

type TimerState = {
  timers: Map<MarkerId, Countdown[]>;
  selectedMarkerId?: string;
};

const TimerDefaults = {
  timers: new Map<MarkerId, Countdown>(),
};

const findTimer = (
  timers: Countdown[],
  markerId: string,
  countdown: Countdown,
) => {
  if (!timers || timers.length === 0) {
    console.error('[TimerModel] No timers found for markerId', markerId);
    return undefined;
  }
  const timer = timers.find(t => t.id === countdown.id);
  if (!timer) {
    console.error('[TimerModel] Timer not found', countdown.id);
    return undefined;
  }
  return timer;
};

export const TimerModel = model<TimerState>('timer').define(_ => {
  return {
    state: TimerDefaults,
    computed: {
      markerTimers: [
        StagedPointMarkerModel,
        (state: TimerState, marker) => {
          console.log('[TimerModel] Marker Mounted', marker);
          if (marker.id) {
            console.log('[TimerModel] Marker Id', marker.id);
            return state.timers.get(marker.id);
          }
          return undefined;
        },
      ],
    },
    actions: {
      setSelectedMarkerId: (state: TimerState, markerId: string) => {
        console.log('[TimerModel] setSelectedMarkerId', markerId);
        state.selectedMarkerId = markerId;
      },
      createAndAddTimer: (state: TimerState, markerId: string) => {
        let timers = state.timers.get(markerId);
        const numberOfTimers = timers?.length;
        if (!timers || numberOfTimers === 0) {
          timers = [DefaultCountdown('Timer', 0)];
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
        );
        console.log(
          '[TimerModel] Created New Timer',
          newTimer,
          timers,
          state.timers,
        );
        state.timers.set(markerId, [...timers, newTimer]);
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
        timer.isRunning = true;
        timer.isPaused = false;
        timer.startTime = new Date();
        timer.pauseTime = undefined;
        timer.timeRemainingSeconds = timer.totalCountdownSeconds;

        const updatedTimers = timers.map(t => {
          if (t.id === countdown.id) {
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
        timer.isRunning = true;
        timer.isPaused = true;
        timer.pauseTime = new Date();
        const updatedTimers = timers.map(t => {
          if (t.id === timer.id) {
            return timer;
          }
          return t;
        });
        state.timers.set(markerId, updatedTimers);
      },
      unpauseTimer: (state, markerId: string, countdown: Countdown) => {
        const timers = state.timers.get(markerId) ?? [];
        const timer = findTimer(timers, markerId, countdown);
        if (!timer) {
          console.error(
            '[TimerModel] No running timer found for markerId',
            markerId,
          );
          return;
        }
        timer.isRunning = true;
        timer.isPaused = false;
        const updatedTimers = timers.map(t => {
          if (t.id === timer.id) {
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
        if (timer.isPaused) {
          console.error('[TimerModel] Timer is paused', timer);
          return;
        }
        if (timer.isRunning) {
          timer.timeRemainingSeconds -= tickValueSeconds;
          if (timer.timeRemainingSeconds <= 0) {
            timer.timeRemainingSeconds = 0;
            timer.isRunning = false;
            timer.isPaused = false;
            timer.startTime = undefined;
            timer.pauseTime = undefined;

            console.log('[TimerModel] Timer has ended', timer);
          }
        }
        const updatedTimers = timers.map(t => {
          if (t.id === timer.id) {
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
        timer.isRunning = false;
        timer.isPaused = false;
        timer.startTime = undefined;
        timer.pauseTime = undefined;
        timer.timeRemainingSeconds = timer.totalCountdownSeconds;

        const updatedTimers = timers.map(t => {
          if (t.id === timer.id) {
            return timer;
          }
          return t;
        });
        console.log('[TimerModel] Reset Timer', timer.name);
        state.timers.set(markerId, updatedTimers);
      },
    },
  };
});
