"use client";

import useOnboarding from "./use-onboarding.hook";

export default function Onboarding() {
  const { stepContent } = useOnboarding();

  return stepContent;
}
