"use client";

import CustomButton from "@/common/components/custom-button/custom-button.component";
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
    isAffiliateWithoutShopify,
    showSoftConfirm,
    handleConfirmSoftRates,
    handleCloseSoftConfirm,
  } = useCreateCampaign(close);

  const canProceed =
    !isAffiliateWithoutShopify &&
    (currentStep < steps.length - 1 || campaignData.termsAgreed);

  return (
    <Modal
      title="Create Campaign"
      show={open}
      onClose={close}
      size="lg"
      height="fixed"
    >
      <div className="mx-auto flex min-h-0 w-full max-w-3xl flex-1 flex-col bg-white">
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
              {isAffiliateWithoutShopify ? (
                <p className="mt-1 text-[10px] text-amber-700 sm:text-xs">
                  Connect your Shopify store to continue.
                </p>
              ) : null}
            </div>

            <div className="space-y-4 sm:space-y-6">{renderStep()}</div>
          </div>
        </CustomStepper>
      </div>

      <Modal
        show={showSoftConfirm}
        onClose={handleCloseSoftConfirm}
        title="Confirm rates"
        size="sm"
      >
        <div className="space-y-4 p-1">
          <p className="text-xs text-gray-700 sm:text-sm">
            That is higher than typical, confirm?
          </p>
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
    </Modal>
  );
}
