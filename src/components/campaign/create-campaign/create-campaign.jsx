"use client";

import CustomStepper from "@/common/components/custom-stepper/custom-stepper";
import Modal from "@/common/components/modal/modal.component";
import useCreateCampaign from "./use-create-campaign";

export default function CampaignCreationWizard({ open, close }) {
  const { currentStep, steps, setCurrentStep, renderStep, showPreview, setShowPreview } =
    useCreateCampaign();

  return (
    <Modal title="Create Campaign" show={open} onClose={close} size="lg" height="fixed">
      <div className="h-full w-full max-w-3xl mx-auto bg-white flex flex-col">
        <CustomStepper
          steps={steps}
          activeStep={currentStep}
          setActiveStep={setCurrentStep}
          showPreview={showPreview}
          setShowPreview={setShowPreview}
          onStepClick={(index) => setCurrentStep(index)}
        >
          <div className="p-4">
            <h3 className="mb-2">{steps[currentStep]}</h3>
            <div className="flex-1 overflow-y-auto">{renderStep()}</div>
          </div>
        </CustomStepper>
      </div>
    </Modal>
  );
}
