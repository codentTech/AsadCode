import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import Modal from "@/common/components/modal/modal.component";
import TextArea from "@/common/components/text-area/text-area.component";
import { CAMPAIGN_TYPE, COMPENSATION_TYPE } from "@/common/constants/campaign.constant";
import {
  CAMPAIGN_TYPE_OPTIONS,
  COMPENSATION_TYPE_OPTIONS,
  EXCLUSIVITY_CLAUSE_OPTIONS,
  REVISION_LIMIT_OPTIONS,
  USAGE_RIGHTS_OPTIONS,
} from "@/common/constants/options.constant";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import ContractPreviewModal from "../contract-preview-modal/contract-preview-modal.component";
import useHireCreator from "./use-hire-creator.hook";

export default function HireCreatorModal({
  show,
  onClose,
  creatorData,
  campaignData,
  onSendOffer,
  isLoading = false,
}) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    errors,
    setValue,
    watch,
    getCompensationInputLabel,
    isCompensationRequired,
    createEnrichedContractData,
    hasPaymentMethod,
    isCheckingPaymentMethod,
    isPaymentRequired,
    showPreview,
    setShowPreview,
    handlePreviewContract,
    handleFormSubmit,
    isSubmitting,
    revisionsLimitValue,
    usageRightsValue,
    exclusivityValue,
    campaignTypeValue,
    isIndividualCollaboration,
  } = useHireCreator({
    creatorData,
    campaignData,
    onSendOffer,
    isLoading,
    showModal: show,
    onClose,
  });

  return (
    <Modal title="Review & Send Offer" show={show} onClose={onClose} size="lg">
      {/* Payment Method Warning — only for paid offers (gifted/affiliate bypass) */}
      {isPaymentRequired() && !isCheckingPaymentMethod && !hasPaymentMethod && (
        <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-yellow-900 mb-1">Payment method required</p>
              <p className="text-xs text-yellow-700 mb-3">
                You must add a payment method before sending offers. No charge occurs when sending
                an offer - payment is only processed when the creator accepts.
              </p>
              <CustomButton
                text="Add Payment Method"
                className="btn-primary text-xs"
                onClick={() => {
                  onClose();
                  router.push("/settings/payments/payment-methods");
                }}
              />
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        {/* General Information */}
        <div>
          <h3 className="font-bold mb-2">General Information</h3>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <CustomInput
              label="Campaign Title"
              value={
                isIndividualCollaboration
                  ? "Individual Collaboration"
                  : campaignData?.campaign_title || ""
              }
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
              options={REVISION_LIMIT_OPTIONS}
              defaultValue={revisionsLimitValue}
              onChange={(option) => setValue("revisionsLimit", option.value)}
              errors={errors}
              name="revisionsLimit"
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
          {isIndividualCollaboration && (
            <div className="w-full mt-4">
              <TextArea
                label="Content Guidelines / Brief"
                register={register}
                name="contentGuidelines"
                errors={errors}
                placeholder="Enter content guidelines and brief for this collaboration..."
                isRequired={true}
              />
            </div>
          )}
        </div>

        {/* Payment Terms */}
        <div>
          <h3 className="font-bold mb-2">Payment Terms</h3>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {isIndividualCollaboration && (
              <div>
                <SimpleSelect
                  label="Campaign Type"
                  options={CAMPAIGN_TYPE_OPTIONS}
                  defaultValue={campaignTypeValue}
                  onChange={(option) => setValue("campaignType", option.value)}
                  errors={errors}
                  name="campaignType"
                  isRequired={true}
                />
              </div>
            )}
            <div>
              <SimpleSelect
                label="Compensation Type"
                options={COMPENSATION_TYPE_OPTIONS}
                defaultValue={watch?.compensationType || COMPENSATION_TYPE.PAID}
                onChange={(option) => setValue("compensationType", option.value)}
                errors={errors}
                name="compensationType"
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
            {watch?.compensationType === COMPENSATION_TYPE.COMMISSION && (
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
          {isIndividualCollaboration && campaignTypeValue === CAMPAIGN_TYPE.UGC && (
            <p className="text-xs text-gray-600 mt-3">
              UGC: the creator timeline has two steps (recorded → draft delivery). They are not asked
              to submit a published post link.
            </p>
          )}
        </div>

        {/* Legal & Compliance */}
        <div>
          <h3 className="font-bold mb-2">Legal & Compliance</h3>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <SimpleSelect
                label="Exclusivity Clause"
                options={EXCLUSIVITY_CLAUSE_OPTIONS}
                defaultValue={exclusivityValue}
                onChange={(option) => setValue("exclusivityClause", option.value)}
                errors={errors}
                name="exclusivityClause"
              />
            </div>
            <div>
              <SimpleSelect
                label="Usage Rights"
                options={USAGE_RIGHTS_OPTIONS}
                defaultValue={usageRightsValue}
                onChange={(option) => setValue("usageRights", option.value)}
                errors={errors}
                name="usageRights"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 border-t border-gray-200 pt-4">
          <CustomButton
            text="Save Draft"
            className="btn-outline"
            type="button"
            onClick={() => {}}
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
            loading={isSubmitting}
            disabled={
              isSubmitting ||
              (isPaymentRequired() && !hasPaymentMethod) ||
              isCheckingPaymentMethod
            }
          />
        </div>
      </form>

      {/* Contract Preview Modal */}
      <ContractPreviewModal
        show={showPreview}
        onClose={() => setShowPreview(false)}
        contractData={createEnrichedContractData(watch)}
      />
    </Modal>
  );
}
