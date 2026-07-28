import { ArrowBack } from "@mui/icons-material";
import CheckIcon from "@mui/icons-material/Check";
import PropTypes from "prop-types";
import React from "react";
import CustomButton from "../custom-button/custom-button.component";
import useCustomStepper from "./use-custom-stepper";

/**
 * CustomStepper - A flexible and reusable stepper component
 *
 * @param {Object} props Component props
 * @param {Array} props.steps Array of step objects with { label, optional description }
 * @param {number} props.activeStep Current active step index (zero-based)
 * @param {boolean} props.allowClickOnCompleted Allow clicking on completed steps to navigate back
 * @param {function} props.setActiveStep Callback function to change the active step
 * @param {function} props.onStepClick Callback function when step is clicked - receives step index
 * @param {string} props.orientation 'horizontal' or 'vertical'
 * @param {Object} props.colors Custom color scheme
 * @param {boolean} props.showLabels Whether to show step labels
 * @param {React.ReactNode} props.completedIcon Custom icon for completed steps
 * @returns {React.ReactNode} The stepper component
 */
const CustomStepper = ({
  steps = [],
  activeStep = 0,
  setActiveStep = () => {},
  showPreview,
  setShowPreview,
  allowClickOnCompleted = true,
  onStepClick = () => {},
  orientation = "horizontal",
  colors = {},
  showLabels = true,
  children,
  // New props for validation and submission
  onNext = null,
  onSave = null,
  isLoading = false,
  canProceed = true,
  showStepIndicator = true,
  hidePreviousOnFirstStep = false,
}) => {
  const {
    nextStep: defaultNextStep,
    prevStep,
    editCampaign: defaultEditCampaign,
  } = useCustomStepper({
    steps,
    activeStep,
    setActiveStep,
    showPreview,
    setShowPreview,
  });

  // Use custom handlers if provided, otherwise use defaults
  const handleNext = onNext || defaultNextStep;
  const handleSave = onSave || defaultEditCampaign;

  // Handle click on a step
  const handleStepClick = (index) => {
    if (index < activeStep || index === activeStep) {
      onStepClick(index);
    }
  };

  // Render horizontal stepper
  const renderHorizontalStepper = () => (
    <div className="rounded-lg border border-solid border-gray-50 bg-blue-50 p-2 sm:p-3">
      <div className="-mx-1 overflow-x-auto overscroll-x-contain px-1 pb-1 sm:mx-0 sm:overflow-visible sm:px-0 sm:pb-0">
        <div className="relative flex min-w-[36rem] items-start justify-between gap-1 sm:min-w-0 sm:w-full sm:items-center sm:gap-0">
          <div className="absolute left-0 top-3 z-0 h-0.5 w-full bg-primary sm:top-[14px]" />

          {steps.map((step, index) => (
            <div
              key={index}
              className="relative z-10 flex w-full min-w-0 max-w-[5.5rem] flex-col items-center sm:max-w-none"
              onClick={() => allowClickOnCompleted && handleStepClick(index)}
            >
              <div
                className={`z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 text-[11px] transition-all duration-300 sm:h-7 sm:w-7 sm:text-sm ${
                  index < activeStep
                    ? "border-blue-600 bg-blue-600 text-white"
                    : index === activeStep
                      ? "border-blue-600 bg-white text-blue-600"
                      : "border-gray-300 bg-white text-gray-400"
                }`}
              >
                {index < activeStep ? (
                  <CheckIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                ) : (
                  index + 1
                )}
              </div>

              {showLabels && (
                <span
                  className={`mt-1.5 line-clamp-2 w-full max-w-[5rem] px-0.5 text-center text-[10px] font-medium leading-tight sm:mt-2 sm:max-w-[6.25rem] sm:text-xs ${
                    index < activeStep
                      ? "text-blue-600"
                      : index === activeStep
                        ? "font-semibold text-blue-600"
                        : "text-gray-400"
                  }`}
                >
                  {step}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Render vertical stepper
  const renderVerticalStepper = () => (
    <div className="p-3 bg-gray-50 border rounded-lg">
      <div className="relative flex flex-col space-y-10">
        {/* Connecting Line - Background */}
        <div className="absolute top-0 bottom-0 left-5 w-0.5 bg-gray-200 z-0" />

        {steps.map((step, index) => (
          <div
            key={index}
            className="relative z-10 flex items-start"
            onClick={() => allowClickOnCompleted && handleStepClick(index)}
          >
            {/* Step Circle */}
            <div
              className={`relative z-10 w-10 h-10 flex items-center justify-center rounded-full border-2 transition-all duration-300 ${
                index < activeStep
                  ? "bg-blue-600 border-blue-600 text-white"
                  : index === activeStep
                    ? "bg-white border-blue-600 text-blue-600"
                    : "bg-white border-gray-300 text-gray-400"
              }`}
            >
              {index < activeStep ? <CheckIcon className="h-4 w-4" /> : index + 1}
            </div>

            {/* Label and Description */}
            {showLabels && (
              <div className="ml-4">
                <span
                  className={`text-sm font-medium block ${
                    index < activeStep
                      ? "text-blue-600"
                      : index === activeStep
                        ? "text-blue-600 font-semibold"
                        : "text-gray-400"
                  }`}
                >
                  {step}
                </span>
                {step.description && (
                  <p className="text-xs text-gray-500 mt-1 max-w-[250px]">{step}</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex h-full min-h-0 flex-col">
      {showStepIndicator
        ? orientation === "vertical"
          ? renderVerticalStepper()
          : renderHorizontalStepper()
        : null}

      <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>

      <div className="bg-indigo-100 sticky bottom-0 z-[1] mt-auto flex flex-col gap-2 border-t p-3 shadow-lg sm:flex-row sm:items-center sm:justify-between sm:p-4">
        {hidePreviousOnFirstStep && activeStep === 0 ? (
          <div className="order-2 hidden sm:order-1 sm:block sm:w-auto" />
        ) : (
          <CustomButton
            text="Previous"
            onClick={prevStep}
            disabled={activeStep === 0}
            className="btn-outline order-2 flex w-full items-center justify-center rounded-md py-2.5 sm:order-1 sm:w-auto sm:justify-start sm:px-4"
            startIcon={<ArrowBack className="mr-1 h-4 w-4" />}
          />
        )}

        <CustomButton
          text={
            isLoading ? "Processing" : activeStep < steps.length - 1 ? "Next" : "Launch Campaign"
          }
          onClick={activeStep < steps.length - 1 ? handleNext : handleSave}
          disabled={!canProceed || isLoading}
          className={`btn-primary order-1 w-full py-2.5 sm:order-2 sm:w-auto ${!canProceed || isLoading ? "cursor-not-allowed opacity-50" : ""}`}
          loading={isLoading}
        />
      </div>
    </div>
  );
};

CustomStepper.propTypes = {
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      description: PropTypes.string,
    })
  ).isRequired,
  activeStep: PropTypes.number,
  allowClickOnCompleted: PropTypes.bool,
  onStepClick: PropTypes.func,
  orientation: PropTypes.oneOf(["horizontal", "vertical"]),
  colors: PropTypes.object,
  showLabels: PropTypes.bool,
  completedIcon: PropTypes.node,
};

export default CustomStepper;
