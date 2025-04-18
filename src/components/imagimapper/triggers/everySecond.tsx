import { FC, useEffect, useRef } from 'react';
import { useModel } from '@modern-js/runtime/model';
import { Countdown } from '@shared/_types';
import { TimerModel } from '../state/timers';

const EverySecond: FC = () => {
  const [{ timers }, timerActions] = useModel(TimerModel);
  const countdownRefs =
    useRef<
      Map<string, { countdown: Countdown; uiState: { isEditing: boolean } }[]>
    >(timers);

  useEffect(() => {
    countdownRefs.current = timers;
  }, [timers]);

  useEffect(() => {
    let timerId: NodeJS.Timeout;
    let expectedTime = Date.now() + 1000;

    const scheduleTick = () => {
      const now = Date.now();
      const delay = Math.max(0, expectedTime - now);

      timerId = setTimeout(() => {
        // console.log(`[EverySecond] Timer tick at ${new Date().toISOString()}`);

        const timers = countdownRefs.current;
        if (!timers) {
          console.error('[EverySecond] No timers found');
          return;
        }

        timers.forEach((countdowns, markerId) => {
          countdowns.forEach(({ countdown }) => {
            if (countdown.isRunning && !countdown.isPaused) {
              timerActions.tickTimer(markerId, countdown, 1);
            }
          });
        });

        expectedTime += 1000;

        scheduleTick();
      }, delay);
    };

    scheduleTick();

    return () => clearTimeout(timerId);
  }, []);

  return null;
};

export default EverySecond;
