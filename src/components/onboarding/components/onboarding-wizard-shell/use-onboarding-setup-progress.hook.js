import { useContext, useEffect, useRef } from "react";
import { OnboardingGuidanceContext } from "./use-onboarding-wizard-shell.hook";

export default function useOnboardingSetupProgress(percent, steps, enabled = true) {
  const ctx = useContext(OnboardingGuidanceContext);
  const serialized = JSON.stringify({ percent, steps });
  const enabledRef = useRef(enabled);
  enabledRef.current = enabled;

  useEffect(() => {
    if (!ctx?.setSetupProgress || !enabled) return;

    const next = JSON.parse(serialized);
    ctx.setSetupProgress((prev) =>
      prev && JSON.stringify(prev) === serialized ? prev : next
    );
  }, [ctx, enabled, serialized]);

  useEffect(() => {
    if (!ctx?.setSetupProgress) return undefined;
    return () => {
      if (enabledRef.current) ctx.setSetupProgress(null);
    };
  }, [ctx]);
}
