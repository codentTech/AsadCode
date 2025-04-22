"use client";

import PropTypes from "prop-types";
import useCountDown from "./use-count-down.hook";

export default function CountDown({
  minutes = 2,
  stopTimerHandler,
  isRunTimer = true,
}) {
  const { seconds, remainingMinutes } = useCountDown({
    minutes,
    stopTimerHandler,
    isRunTimer,
  });
  return (
    <p className="text-[12px] font-medium leading-[18px] text-[#46474F]">
      Time left: {remainingMinutes}:{seconds}
    </p>
  );
}

CountDown.propTypes = {
  minutes: PropTypes.number,
  stopTimerHandler: PropTypes.func.isRequired,
  isRunTimer: PropTypes.bool.isRequired,
};
