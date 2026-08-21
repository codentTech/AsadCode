import { useContext, useEffect, useMemo, useRef } from "react";
import { OnboardingGuidanceContext } from "./use-onboarding-wizard-shell.hook";

function safeProgressKey(percent, steps) {
  try {
    return JSON.stringify({
      percent: Number(percent) || 0,
      steps: (Array.isArray(steps) ? steps : []).map((step) => ({
        label: step?.label ?? "",
        status: step?.status ?? "",
        count: step?.count ?? null,
      })),
    });
  } catch {
    return `percent:${Number(percent) || 0}`;
  }
}

export default function useOnboardingSetupProgress(percent, steps, enabled = true) {
  const ctx = useContext(OnboardingGuidanceContext);
  const setSetupProgress = ctx?.setSetupProgress;
  const progressKey = useMemo(() => safeProgressKey(percent, steps), [percent, steps]);
  const enabledRef = useRef(enabled);
  enabledRef.current = enabled;

  useEffect(() => {
    if (!setSetupProgress || !enabled) return;

    let next;
    try {
      next = JSON.parse(progressKey);
    } catch {
      next = { percent: Number(percent) || 0, steps: [] };
    }

    setSetupProgress((prev) => {
      try {
        if (prev && JSON.stringify(prev) === progressKey) return prev;
      } catch {
        // fall through and replace
      }
      return next;
    });
  }, [setSetupProgress, enabled, progressKey, percent]);

  useEffect(() => {
    if (!setSetupProgress) return undefined;
    return () => {
      if (enabledRef.current) setSetupProgress(null);
    };
  }, [setSetupProgress]);
}
