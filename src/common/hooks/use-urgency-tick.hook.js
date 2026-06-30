import { useEffect, useState } from "react";

const URGENCY_TICK_MS = 60_000;

export default function useUrgencyTick() {
  const [urgencyTick, setUrgencyTick] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setUrgencyTick((tick) => tick + 1);
    }, URGENCY_TICK_MS);

    return () => clearInterval(intervalId);
  }, []);

  return urgencyTick;
}
