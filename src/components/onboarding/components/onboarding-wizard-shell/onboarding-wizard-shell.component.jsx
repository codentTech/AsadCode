"use client";

import CustomButton from "@/common/components/custom-button/custom-button.component";
import { ArrowLeft, ArrowRight, Check, Home, Lightbulb, ListChecks } from "lucide-react";
import SetupProgress from "../setup-progress/setup-progress.component";
import useOnboardingWizardShell, {
  OnboardingGuidanceContext,
} from "./use-onboarding-wizard-shell.hook";

export default function OnboardingWizardShell({
  title,
  steps,
  activeIndex,
  onBack,
  onStepSelect,
  showBack = true,
  children,
}) {
  const {
    total,
    safeIndex,
    currentStepMeta,
    progressPercent,
    nextMeta,
    setupProgress,
    guidanceValue,
  } = useOnboardingWizardShell({
    title,
    steps,
    activeIndex,
    onBack,
    onStepSelect,
    showBack,
  });

  return (
    <OnboardingGuidanceContext.Provider value={guidanceValue}>
      <div className="flex h-screen min-h-screen flex-col overflow-hidden bg-gray-50">
        <div className="flex shrink-0 items-center gap-2 border-b border-gray-200 bg-white px-3 py-2 md:hidden">
          {showBack ? (
            <button
              type="button"
              onClick={onBack}
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-gray-300 text-gray-700"
              aria-label="Back"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
          ) : null}
          <div className="min-w-0 flex-1 mt-1">
            <p className="truncate text-sm font-semibold text-black">{currentStepMeta.name}</p>
            <div className="mt-1 h-1 overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
          <span className="shrink-0 text-[10px] font-semibold tabular-nums text-gray-500">
            {safeIndex + 1}/{total}
          </span>
        </div>

        <div className="flex min-h-0 flex-1 overflow-hidden">
          <aside className="hidden w-[260px] shrink-0 flex-col border-r border-gray-200 bg-white lg:w-[280px] md:flex">
            <div className="border-b border-gray-200">
              <div className="flex items-center gap-2 px-3 py-[13px]">
                {showBack ? (
                  <button
                    type="button"
                    onClick={onBack}
                    className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
                    aria-label="Back"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                ) : null}
                <p className="min-w-0 flex-1 truncate text-sm font-semibold text-black">{title}</p>
              </div>
              <div className="h-[3.5px] w-full bg-gray-200">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <nav
              className="min-h-0 flex-1 space-y-0.5 overflow-y-auto p-2"
              aria-label="Onboarding steps"
            >
              {steps.map((step, index) => {
                const isDone = index < safeIndex;
                const isActive = index === safeIndex;
                const isLocked = index > safeIndex;

                return (
                  <button
                    key={step.id}
                    type="button"
                    disabled={Boolean(step.disabled) || isLocked}
                    onClick={() => onStepSelect?.(index)}
                    className={`flex w-full items-start gap-2 rounded-md px-2 py-2 text-left ${
                      isActive
                        ? "bg-primary/10"
                        : isDone && !step.disabled
                          ? "hover:bg-gray-50"
                          : isLocked || step.disabled
                            ? "cursor-not-allowed opacity-50"
                            : "hover:bg-gray-50"
                    }`}
                  >
                    <span
                      className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                        isDone
                          ? "bg-primary text-white"
                          : isActive
                            ? "border-2 border-primary bg-white text-primary"
                            : "border border-gray-300 bg-white text-gray-400"
                      }`}
                    >
                      {isDone ? <Check className="h-3.5 w-3.5" /> : index + 1}
                    </span>
                    <span className="min-w-0">
                      <span
                        className={`block text-xs font-medium leading-snug ${
                          isActive || isDone ? "text-black" : "text-gray-500"
                        }`}
                      >
                        {step.name}
                      </span>
                      <span className="mt-0.5 block text-[10px] leading-snug text-gray-500">
                        {step.description}
                      </span>
                    </span>
                  </button>
                );
              })}
            </nav>

            <div className="shrink-0 border-t border-gray-200 px-2 py-4">
              <CustomButton
                text="Back to home"
                href="/"
                className="btn-outline w-full"
                startIcon={<Home className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
              />
            </div>
          </aside>

          <section className="flex min-h-0 min-w-0 flex-1 overflow-hidden">
            <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-white">
              <div className="shrink-0 border-b border-indigo-300 bg-indigo-100 text-left">
                <div className="flex items-center justify-between gap-3 px-3 py-2 sm:px-4 md:px-5">
                  <div className="min-w-0 flex-1">
                    <h2 className="truncate text-sm font-semibold text-black sm:text-base">
                      {currentStepMeta.name}
                    </h2>
                    <p className="mt-0.5 truncate text-[10px] leading-snug text-gray-700 sm:text-xs">
                      {currentStepMeta.description}
                    </p>
                  </div>
                  <div className="inline-flex shrink-0 items-center gap-2 rounded-md bg-white/80 px-2 py-1">
                    <span className="hidden rounded bg-primary px-1.5 py-0.5 text-[10px] font-bold text-white md:inline sm:text-xs">
                      {safeIndex + 1}/{total}
                    </span>
                    <span className="text-[10px] font-semibold tabular-nums text-gray-700 sm:text-xs">
                      {progressPercent}% complete
                    </span>
                  </div>
                </div>
                <div className="h-0.5 w-full bg-indigo-300/80">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {setupProgress ? (
                <div className="shrink-0 border-b border-gray-200 bg-gray-50 px-3 py-2 xl:hidden sm:px-4">
                  <SetupProgress
                    compact
                    percent={setupProgress.percent}
                    steps={setupProgress.steps}
                  />
                </div>
              ) : null}

              <div className="flex min-h-0 flex-1 flex-col overflow-hidden">{children}</div>
            </div>

            <aside className="hidden w-[300px] shrink-0 flex-col border-l border-gray-200 bg-gray-50 xl:flex lg:w-[320px]">
              <div className="border-b border-gray-200 px-4 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                  Guidance
                </p>
                <p className="mt-1 text-sm font-semibold text-black">{currentStepMeta.name}</p>
                <p className="mt-1 text-xs leading-snug text-gray-600">
                  {currentStepMeta.description}
                </p>
              </div>

              <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
                {setupProgress ? (
                  <SetupProgress percent={setupProgress.percent} steps={setupProgress.steps} />
                ) : null}

                <div className="rounded-lg border border-gray-200 bg-white p-3.5">
                  <div className="flex items-start gap-2">
                    <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-black">Tip</p>
                      <p className="mt-1 text-xs leading-snug text-gray-600">
                        {currentStepMeta.tip}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-3.5">
                  <div className="flex items-start gap-2">
                    <ListChecks className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-black">Checklist</p>
                      <ul className="mt-2 space-y-1.5">
                        {(currentStepMeta.guide || []).map((item) => (
                          <li key={item} className="flex gap-2 text-xs leading-snug text-gray-600">
                            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {nextMeta ? (
                  <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-3.5">
                    <div className="flex items-start gap-2">
                      <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <div className="min-w-0">
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                          Up next
                        </p>
                        <p className="mt-1 text-xs font-semibold text-black">{nextMeta.name}</p>
                        <p className="mt-1 text-xs leading-snug text-gray-600">
                          {nextMeta.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </aside>
          </section>
        </div>
      </div>
    </OnboardingGuidanceContext.Provider>
  );
}
