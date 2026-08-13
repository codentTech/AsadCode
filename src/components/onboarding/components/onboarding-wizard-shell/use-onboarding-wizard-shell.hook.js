import { createContext, useMemo, useState } from "react";

export const OnboardingGuidanceContext = createContext(null);

export default function useOnboardingWizardShell({
  title,
  steps,
  activeIndex,
  onBack,
  onStepSelect,
  showBack = true,
}) {
  const [setupProgress, setSetupProgress] = useState(null);
  const total = steps.length || 1;
  const safeIndex = Math.min(Math.max(activeIndex, 0), total - 1);
  const currentStepMeta = steps[safeIndex] || {};
  const progressPercent = Math.round(((safeIndex + 1) / total) * 100);
  const nextMeta = currentStepMeta.next || null;
  const guidanceValue = useMemo(() => ({ setSetupProgress }), []);

  return {
    title,
    steps,
    onBack,
    onStepSelect,
    showBack,
    total,
    safeIndex,
    currentStepMeta,
    progressPercent,
    nextMeta,
    setupProgress,
    guidanceValue,
  };
}
