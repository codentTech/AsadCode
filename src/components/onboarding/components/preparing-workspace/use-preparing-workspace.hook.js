"use client";

import useBackgroundEffect from "@/common/hooks/use-background-effect.hook";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const randomBetween = (min, max) => min + Math.random() * (max - min);

const createSparkleField = () => {
  const makeSide = (side, count) =>
    Array.from({ length: count }, (_, index) => ({
      id: `${side}-${index}-${Math.random().toString(36).slice(2, 7)}`,
      left: side === "left" ? randomBetween(2, 40) : randomBetween(60, 98),
      top: randomBetween(2, 98),
      size: randomBetween(10, 16),
      delay: randomBetween(0, 1.8),
      duration: randomBetween(2, 3.2),
      driftX: randomBetween(-10, 10),
      driftY: randomBetween(-12, 8),
    }));

  return [...makeSide("left", 6), ...makeSide("right", 6)];
};

const CHECKLIST = [
  { id: "profile", label: "Saving your profile", at: 22 },
  { id: "preferences", label: "Applying your preferences", at: 48 },
  { id: "workspace", label: "Preparing your workspace", at: 74 },
  { id: "ready", label: "Getting you ready to go", at: 96 },
];

const STAGES = [
  {
    min: 0,
    title: "Just a moment",
    detail: "We’re wrapping up your setup. This usually takes a few seconds.",
  },
  {
    min: 18,
    title: "Saving your details",
    detail: "Locking in your profile so everything stays in sync.",
  },
  {
    min: 40,
    title: "Preparing your workspace",
    detail: "Setting up the tools you’ll use every day.",
  },
  {
    min: 65,
    title: "Almost ready",
    detail: "Putting the finishing touches in place. Please wait.",
  },
  {
    min: 90,
    title: "You’re all set",
    detail: "Your account is ready. We’ll take you in shortly.",
  },
];

export default function usePreparingWorkspace({ onReady } = {}) {
  const { position } = useBackgroundEffect();
  const [percent, setPercent] = useState(0);
  const [cycle, setCycle] = useState(0);
  const [sparkles, setSparkles] = useState(createSparkleField);
  const onReadyRef = useRef(onReady);
  const hasSignaledReadyRef = useRef(false);
  onReadyRef.current = onReady;

  useEffect(() => {
    setPercent(0);
    setSparkles(createSparkleField());
    hasSignaledReadyRef.current = false;
    const id = setInterval(() => {
      setPercent((prev) => {
        if (prev >= 100) {
          clearInterval(id);
          return 100;
        }
        return Math.min(100, prev + 1);
      });
    }, 70);
    return () => clearInterval(id);
  }, [cycle]);

  useEffect(() => {
    if (percent < 100 || hasSignaledReadyRef.current || !onReadyRef.current) return undefined;
    hasSignaledReadyRef.current = true;
    const timer = setTimeout(() => {
      onReadyRef.current?.();
    }, 900);
    return () => clearTimeout(timer);
  }, [percent]);

  const stage = useMemo(
    () => [...STAGES].reverse().find((item) => percent >= item.min) || STAGES[0],
    [percent]
  );

  const checklist = useMemo(
    () =>
      CHECKLIST.map((item) => ({
        ...item,
        done: percent >= item.at,
        active: percent < item.at && percent >= item.at - 22,
      })),
    [percent]
  );

  const isComplete = percent >= 100;
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeOffset = circumference - (percent / 100) * circumference;

  const handleReplay = useCallback(() => {
    setCycle((prev) => prev + 1);
  }, []);

  return {
    position,
    percent,
    stage,
    checklist,
    isComplete,
    circumference,
    strokeOffset,
    sparkles,
    showReplay: !onReady,
    handleReplay,
  };
}
