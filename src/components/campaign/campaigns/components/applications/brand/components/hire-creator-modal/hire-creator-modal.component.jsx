import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import Modal from "@/common/components/modal/modal.component";
import TextArea from "@/common/components/text-area/text-area.component";
import { COMPENSATION_TYPE } from "@/common/constants/campaign.constant";
import { COMPENSATION_TYPE_OPTIONS } from "@/common/constants/options.constant";
import { useEffect, useState } from "react";
import ContractPreviewModal from "../contract-preview-modal/contract-preview-modal.component";
import useHireCreator from "./use-hire-creator.hook";

export default function HireCreatorModal({
  show,
  onClose,
  creatorData,
  campaignData,
  onSendOffer,
  isLoading = false,
  isSuccess = false,
  isError = false,
}) {
  const [showPreview, setShowPreview] = useState(false);

  const {
    register,
    handleSubmit,
    errors,
    onSubmit,
    watch,
    setValue,
    reset,
    initializeForm,
    getCompensationInputLabel,
    isCompensationRequired,
    isSubmitting,
    trigger,
    isValid,
    createEnrichedContractData,
  } = useHireCreator({ creatorData, campaignData, onSendOffer, isLoading });

  // Initialize form when modal opens
  useEffect(() => {
    if (show && campaignData && creatorData) {
      initializeForm();
    }
  }, [show, campaignData, creatorData, initializeForm]);

  // Reset form when modal closes
  useEffect(() => {
    if (!show) {
      reset();
      setShowPreview(false);
    }
  }, [show, reset]);

  const exclusivityOptions = [
    { value: "none", label: "None" },
    { value: "3", label: "3 Months" },
    { value: "6", label: "6 Months" },
    { value: "12", label: "12 Months" },
  ];

  const usageRightsOptions = [
    { value: "no_usage", label: "No Usage Rights" },
    { value: "3", label: "3 Months Usage" },
    { value: "6", label: "6 Months Usage" },
    { value: "12", label: "12 Months Usage" },
    { value: "permanent", label: "Permanent Usage" },
  ];

  const revisionOptions = [
    { value: "0", label: "0 Revisions" },
    { value: "1", label: "1 Revision" },
    { value: "2", label: "2 Revisions" },
    { value: "3", label: "3 Revisions" },
    { value: "4", label: "4 Revisions" },
    { value: "5", label: "5 Revisions" },
  ];

  const handlePreviewContract = () => {
    setShowPreview(true);
  };

  const handleFormSubmit = async (data) => {
    // Trigger validation for all fields
    await trigger();
    onSubmit(data);
  };

  return (
    <Modal title="Review & Send Offer" show={show} onClose={onClose} size="lg">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        {/* General Information */}
        <div>
          <h3 className="font-bold mb-2">General Information</h3>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <CustomInput
              label="Campaign Title"
              value={campaignData?.campaign_title || ""}
              disabled
            />
            <CustomInput label="Contract ID" value="DRAFT" disabled />
            <CustomInput
              label="Start Date"
              type="date"
              register={register}
              name="startDate"
              errors={errors}
              isRequired={true}
            />
          </div>
        </div>

        {/* Deliverables */}
        <div>
          <h3 className="font-bold mb-2">Deliverables</h3>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <CustomInput
              label="1st Draft Deadline (Optional)"
              type="date"
              register={register}
              name="firstDraftDeadline"
              errors={errors}
            />
            <CustomInput
              label="Completion Deadline"
              type="date"
              register={register}
              name="completionDeadline"
              errors={errors}
              isRequired={true}
            />
            <SimpleSelect
              label="Revisions Limit"
              value={watch.revisionsLimit}
              options={revisionOptions}
              onChange={(option) => setValue("revisionsLimit", option.value)}
              error={errors.revisionsLimit?.message}
            />
          </div>
          <div className="w-full mt-4">
            <TextArea
              label="Content Format(s)"
              register={register}
              name="contentFormat"
              errors={errors}
              placeholder="e.g., 1 TikTok, 3 Instagram Stories"
              isRequired={true}
            />
          </div>
        </div>

        {/* Payment Terms */}
        <div>
          <h3 className="font-bold mb-2">Payment Terms</h3>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <SimpleSelect
                label="Compensation Type"
                value={watch.compensationType}
                options={COMPENSATION_TYPE_OPTIONS}
                onChange={(option) => setValue("compensationType", option.value)}
                error={errors}
              />
            </div>
            {isCompensationRequired() && (
              <CustomInput
                label={getCompensationInputLabel()}
                type="number"
                register={register}
                name="totalCompensation"
                errors={errors}
                placeholder="0"
                isRequired={true}
              />
            )}
            {watch.compensationType === COMPENSATION_TYPE.COMMISSION && (
              <CustomInput
                label="Product Price ($)"
                type="number"
                register={register}
                name="productPrice"
                errors={errors}
                placeholder="0"
                isRequired={true}
              />
            )}
          </div>
        </div>

        {/* Legal & Compliance */}
        <div>
          <h3 className="font-bold mb-2">Legal & Compliance</h3>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <SimpleSelect
                label="Exclusivity Clause"
                value={watch.exclusivityClause}
                options={exclusivityOptions}
                onChange={(option) => setValue("exclusivityClause", option.value)}
                error={errors.exclusivityClause?.message}
              />
            </div>
            <div>
              <SimpleSelect
                label="Usage Rights"
                value={watch.usageRights}
                options={usageRightsOptions}
                onChange={(option) => setValue("usageRights", option.value)}
                error={errors.usageRights?.message}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <CustomButton
            text="Save Draft"
            className="btn-outline"
            type="button"
            onClick={() => console.log("Save draft")}
          />
          <CustomButton
            text="Preview Contract"
            className="btn-secondary"
            type="button"
            onClick={handlePreviewContract}
          />
          <CustomButton
            text="Send Offer"
            className="btn-primary"
            type="submit"
            disabled={isSubmitting}
          />
        </div>
      </form>

      {/* Contract Preview Modal */}
      {showPreview && (
        <ContractPreviewModal
          show={showPreview}
          onClose={() => setShowPreview(false)}
          contractData={createEnrichedContractData(watch)}
          creatorData={creatorData}
          campaignData={campaignData}
          onSendOffer={onSendOffer}
          isLoading={isSubmitting}
        />
      )}
    </Modal>
  );
}
