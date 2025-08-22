"use client";

import CustomStepper from "@/common/components/custom-stepper/custom-stepper";
import Modal from "@/common/components/modal/modal.component";
import useCreateCampaign from "./use-create-campaign";

export default function CampaignCreationWizard({ open, close }) {
  const {
    currentStep,
    steps,
    setCurrentStep,
    renderStep,
    showPreview,
    setShowPreview,
  } = useCreateCampaign();

  return (
    <Modal title="Create Campaign" show={open} onClose={close} size="lg" height="fixed">
      <div className="h-full w-full max-w-3xl mx-auto bg-white flex flex-col">
        <CustomStepper
          steps={steps}
          activeStep={currentStep}
          setActiveStep={setCurrentStep}
          showPreview={showPreview}
          setShowPreview={setShowPreview}
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {steps[currentStep]}
              </h3>
            </div>

            <div className="space-y-6">
              {renderStep()}
            </div>

            {/* Navigation buttons at the bottom */}
            <div className="flex justify-between pt-6 mt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setCurrentStep(Math.max(currentStep - 1, 0))}
                disabled={currentStep === 0}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              {currentStep < steps.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep(Math.min(currentStep + 1, steps.length - 1))}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Next
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    // Handle final submission here
                    console.log("Create Campaign clicked");
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Create Campaign
                </button>
              )}
            </div>
          </div>
        </CustomStepper>
      </div>
    </Modal>
  );
}