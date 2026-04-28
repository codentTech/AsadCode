"use client";

import CustomStepper from "@/common/components/custom-stepper/custom-stepper";
import Modal from "@/common/components/modal/modal.component";
import useCreateCampaign from "./use-create-campaign.hook";

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

  const canProceed = currentStep < steps.length - 1 || campaignData.termsAgreed;

  return (
    <Modal
      title="Create Campaign"
      show={open}
      onClose={close}
      size="lg"
      height="fixed"
      fullScreenOnMobile
    >
      <div className="mx-auto flex h-full min-h-0 w-full max-w-3xl flex-col bg-white">
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
          <div className="px-2 py-3 sm:p-4">
            <div className="mb-3 sm:mb-4">
              <h3 className="text-base font-semibold text-primary sm:text-lg">
                {steps[currentStep]}
              </h3>
            </div>

            <div className="space-y-4 sm:space-y-6">{renderStep()}</div>
          </div>
        </CustomStepper>
      </div>
    </Modal>
  );
}
