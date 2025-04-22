'use client';

import { useEffect, useState } from 'react';

export default function useCountDown({ minutes, stopTimerHandler, isRunTimer }) {
  const [countDown, setCountDown] = useState(0);
  const [runTimer, setRunTimer] = useState(true);

  useEffect(() => {
    if (localStorage.getItem('timer')) {
      const time = new Date().getTime() - localStorage.getItem('timer');
      const seconds = Math.floor(time / 1000);
      if (seconds > 0) {
        setCountDown(60 * minutes - seconds);
        setRunTimer(true);
      }
    }
  }, []);

  useEffect(() => {
    setRunTimer(isRunTimer);
  }, [isRunTimer]);

  useEffect(() => {
    let timerId;

    if (runTimer) {
      const timer = localStorage.getItem('timer');
      if (!timer) {
        localStorage.setItem('timer', new Date().getTime());
        setCountDown(60 * minutes);
      }
      timerId = setInterval(() => {
        setCountDown((_countDown) => _countDown - 1);
      }, 1000);
    } else {
      setRunTimer(false);
      clearInterval(timerId);
      stopTimerHandler(true);
    }

    return () => clearInterval(timerId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runTimer]);

  useEffect(() => {
    if (countDown < 0 && runTimer) {
      setRunTimer(false);
      setCountDown(0);
      stopTimerHandler(true);
      localStorage.removeItem('timer', new Date().getTime());
    }
  }, [countDown, runTimer]);

  const seconds = String(countDown % 60).padStart(2, 0);
  const remainingMinutes = String(Math.floor(countDown / 60)).padStart(2, 0);

  return { seconds, remainingMinutes };
}
