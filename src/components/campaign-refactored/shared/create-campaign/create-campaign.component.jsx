"use client";

import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomStepper from "@/common/components/custom-stepper/custom-stepper";
import Modal from "@/common/components/modal/modal.component";
import { ArrowLeft, Check, Lightbulb, ListChecks, Wallet } from "lucide-react";
import useCreateCampaign from "./use-create-campaign.hook";
import { getCompensationGuidanceInfo } from "./wizard-config";

export default function CreateCampaign() {
  const {
    currentStep,
    steps,
    stepMeta,
    currentStepMeta,
    progressPercent,
    campaignData,
    setCurrentStep,
    renderStep,
    showPreview,
    setShowPreview,
    handleNextStep,
    handleSubmit,
    handleStepSelect,
    navigateBack,
    isLoading,
    isAffiliateWithoutShopify,
    canProceed,
    showSoftConfirm,
    handleConfirmSoftRates,
    handleCloseSoftConfirm,
  } = useCreateCampaign();

  const nextStepName =
    currentStep < steps.length - 1 ? steps[currentStep + 1] : "Launch your campaign";
  const nextStepMeta = currentStep < steps.length - 1 ? stepMeta[currentStep + 1] : null;
  const compensationGuidance =
    currentStep === 2 ? getCompensationGuidanceInfo(campaignData, currentStepMeta) : null;

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-gray-50">
      <div className="flex shrink-0 items-center gap-2 border-b border-gray-200 bg-white px-3 py-2 md:hidden">
        <button
          type="button"
          onClick={navigateBack}
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-gray-300 text-gray-700"
          aria-label="Back"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-black">{steps[currentStep]}</p>
          <div className="mt-1 h-1 overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
        <span className="shrink-0 text-[10px] font-semibold tabular-nums text-gray-500">
          {currentStep + 1}/{steps.length}
        </span>
      </div>

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <aside className="hidden w-[260px] shrink-0 flex-col border-r border-gray-200 bg-white lg:w-[280px] md:flex">
          <div className="flex items-center gap-2 border-b border-gray-200 px-3 py-2.5">
            <button
              type="button"
              onClick={navigateBack}
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
              aria-label="Back"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <p className="min-w-0 truncate text-sm font-semibold text-black">Create campaign</p>
          </div>

          <nav
            className="min-h-0 flex-1 space-y-0.5 overflow-y-auto p-2"
            aria-label="Campaign steps"
          >
            {steps.map((stepName, index) => {
              const isDone = index < currentStep;
              const isActive = index === currentStep;
              const isLocked = index > currentStep;
              const meta = stepMeta[index];

              return (
                <button
                  key={stepName}
                  type="button"
                  disabled={isLocked}
                  onClick={() => handleStepSelect(index)}
                  className={`flex w-full items-start gap-2 rounded-md px-2 py-2 text-left ${
                    isActive
                      ? "bg-primary/10"
                      : isDone
                        ? "hover:bg-gray-50"
                        : "cursor-not-allowed opacity-50"
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
                      {stepName}
                    </span>
                    <span className="mt-0.5 block text-[10px] leading-snug text-gray-500">
                      {meta?.description}
                    </span>
                  </span>
                </button>
              );
            })}
          </nav>
        </aside>

        <section className="flex min-h-0 min-w-0 flex-1 overflow-hidden">
          <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-white">
            <div className="shrink-0 border-b border-indigo-300 bg-indigo-100 text-left">
              <div className="flex items-center justify-between gap-3 px-3 py-2 sm:px-4 md:px-5">
                <div className="min-w-0 flex-1">
                  <h2 className="truncate text-sm font-semibold text-black sm:text-base">
                    {steps[currentStep]}
                  </h2>
                  <p className="mt-0.5 truncate text-[10px] leading-snug text-gray-700 sm:text-xs">
                    {currentStepMeta.description}
                  </p>
                  {isAffiliateWithoutShopify ? (
                    <p className="mt-1 text-[10px] text-gray-800 sm:text-xs">
                      Connect your Shopify store to continue.
                    </p>
                  ) : null}
                </div>
                <div className="inline-flex shrink-0 items-center gap-2 rounded-md bg-white/80 px-2 py-1">
                  <span className="rounded bg-primary px-1.5 py-0.5 text-[10px] font-bold text-white sm:text-xs">
                    {currentStep + 1}/{steps.length}
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

            <div className="min-h-0 flex-1 overflow-hidden">
              <CustomStepper
                steps={steps}
                activeStep={currentStep}
                setActiveStep={setCurrentStep}
                showPreview={showPreview}
                setShowPreview={setShowPreview}
                onNext={handleNextStep}
                onSave={handleSubmit}
                isLoading={isLoading}
                canProceed={canProceed}
                showStepIndicator={false}
                hidePreviousOnFirstStep
              >
                <div className="px-3 py-2.5 text-left sm:px-4 sm:py-3 md:px-5">
                  <div className="w-full">{renderStep()}</div>
                </div>
              </CustomStepper>
            </div>
          </div>

          <aside className="hidden w-[300px] shrink-0 flex-col border-l border-gray-200 bg-gray-50 xl:flex lg:w-[320px]">
            <div className="border-b border-gray-200 px-4 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                Guidance
              </p>
              <p className="mt-1 text-sm font-semibold text-black">{steps[currentStep]}</p>
              <p className="mt-1 text-xs leading-snug text-gray-600">
                {currentStepMeta.description}
              </p>
            </div>

            <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
              {compensationGuidance ? (
                <div className="rounded-lg border border-gray-200 bg-white p-3.5">
                  <div className="flex items-start gap-2">
                    <Wallet className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <div className="min-w-0">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                        Compensation
                      </p>
                      <p className="mt-1 text-xs font-semibold text-black">
                        {compensationGuidance.title}
                      </p>
                      <p className="mt-1 text-xs leading-snug text-gray-600">
                        {compensationGuidance.detail}
                      </p>
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="rounded-lg border border-gray-200 bg-white p-3.5">
                <div className="flex items-start gap-2">
                  <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-black">Tip</p>
                    <p className="mt-1 text-xs leading-snug text-gray-600">{currentStepMeta.tip}</p>
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

              <div className="rounded-lg border border-gray-200 bg-white p-3.5">
                <p className="text-xs font-semibold text-black">Up next</p>
                <p className="mt-1 text-xs font-medium text-gray-800">{nextStepName}</p>
                {nextStepMeta?.description ? (
                  <p className="mt-1 text-xs leading-snug text-gray-500">
                    {nextStepMeta.description}
                  </p>
                ) : (
                  <p className="mt-1 text-xs leading-snug text-gray-500">
                    Your campaign will go live for creators to discover and apply.
                  </p>
                )}
              </div>
            </div>
          </aside>
        </section>
      </div>

      <Modal
        show={showSoftConfirm}
        onClose={handleCloseSoftConfirm}
        title="Confirm rates"
        size="sm"
      >
        <div className="space-y-4 p-1">
          <p className="text-xs text-gray-700 sm:text-sm">That is higher than typical, confirm?</p>
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <CustomButton
              text="Go back"
              className="btn-outline w-full sm:w-auto"
              onClick={handleCloseSoftConfirm}
            />
            <CustomButton
              text="Confirm"
              className="btn-primary w-full sm:w-auto"
              onClick={handleConfirmSoftRates}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
