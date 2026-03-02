"use client";

import CustomStepper from "@/common/components/custom-stepper/custom-stepper";
import Modal from "@/common/components/modal/modal.component";
import useCreateCampaign from "./use-create-campaign.hook";

/**
 * Campaign Creation Wizard Component
 *
 * A multi-step form wizard for creating campaigns with validation,
 * file uploads, and comprehensive campaign configuration.
 */
export default function CampaignCreationWizard({ open, close }) {
  const {
    currentStep,
    steps,
    setCurrentStep,
    renderStep,
    showPreview,
    setShowPreview,
    handleNextStep,
    handleSubmit,
    isLoading,
    campaignData,
  } = useCreateCampaign(close);

  // Check if user can proceed to next step or submit
  const canProceed = currentStep < steps.length - 1 || campaignData.termsAgreed;

  return (
    <Modal title="Create Campaign" show={open} onClose={close} size="lg" height="fixed">
      <div className="h-full w-full max-w-3xl mx-auto bg-white flex flex-col">
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
        >
          <div className="p-4">
            {/* Step Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-primary">{steps[currentStep]}</h3>
            </div>

            {/* Step Content */}
            <div className="space-y-6">{renderStep()}</div>
          </div>
        </CustomStepper>
      </div>
    </Modal>
  );
}
