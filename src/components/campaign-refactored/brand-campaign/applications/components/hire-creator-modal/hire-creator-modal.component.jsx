import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import Modal from "@/common/components/modal/modal.component";
import TextArea from "@/common/components/text-area/text-area.component";
import { CAMPAIGN_TYPE, COMPENSATION_TYPE } from "@/common/constants/campaign.constant";
import {
  CAMPAIGN_TYPE_OPTIONS,
  COMPENSATION_TYPE_OPTIONS,
  HIRE_EXCLUSIVITY_CLAUSE_OPTIONS,
  HIRE_USAGE_RIGHTS_OPTIONS,
  REVISION_LIMIT_OPTIONS,
} from "@/common/constants/options.constant";
import { AlertCircle, RefreshCw } from "lucide-react";
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
    canFundCollaborations,
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
    usageRightsOption,
    exclusivityOption,
    campaignTypeValue,
    isIndividualCollaboration,
    refreshPaymentStatus,
    isAffiliateOffer,
    isCompensationTypeLocked,
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
      {isPaymentRequired() && !canFundCollaborations && (
        <div className="mb-4 rounded-lg border border-yellow-200 bg-yellow-50 p-3 sm:p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5 animate-ping" />
            <div className="flex-1">
              <p className="mb-1 text-xs font-medium text-yellow-900 sm:text-sm">
                {!hasPaymentMethod
                  ? "Payment method required"
                  : "Stripe business connection required"}
              </p>
              <p className="text-[10px] text-yellow-700 sm:text-xs">
                {!hasPaymentMethod
                  ? "Add a card before sending paid offers. No charge occurs when sending an offer — your card is charged when the creator accepts."
                  : "Complete Stripe business onboarding under Payment Methods so escrow funding can run when a creator accepts."}
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={refreshPaymentStatus}
                disabled={isCheckingPaymentMethod}
                className="inline-flex h-8 min-h-8 w-full items-center justify-center gap-1.5 rounded-md border border-yellow-300 bg-white px-2.5 text-xs font-medium text-yellow-800 transition-colors hover:bg-yellow-100 disabled:cursor-not-allowed disabled:opacity-60 sm:w-8 sm:px-0"
                aria-label="Refresh payment status"
                title="Refresh payment status"
              >
                <RefreshCw
                  className={`h-4 w-4 shrink-0 ${isCheckingPaymentMethod ? "animate-spin" : ""}`}
                  aria-hidden
                />
                <span className="sm:hidden">Refresh status</span>
              </button>
              <CustomButton
                text="Open payment settings"
                className="btn-primary w-full sm:w-auto"
                onClick={() => {
                  window.open(
                    "/settings/payments/payment-methods",
                    "_blank",
                    "noopener,noreferrer"
                  );
                }}
              />
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 sm:space-y-5">
        {/* General Information */}
        <div>
          <h3 className="mb-2 text-sm font-semibold text-gray-900 sm:text-base">
            General Information
          </h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
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
          <h3 className="mb-2 text-sm font-semibold text-gray-900 sm:text-base">Deliverables</h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
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
          <div className="mt-3 w-full sm:mt-4">
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
            <div className="mt-3 w-full sm:mt-4">
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
          <h3 className="mb-2 text-sm font-semibold text-gray-900 sm:text-base">Payment Terms</h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
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
                isDisabled={isCompensationTypeLocked}
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
            {isAffiliateOffer && (
              <CustomInput
                label="Discount for the shopper (%)"
                type="number"
                name="customerDiscountPercent"
                register={register}
                value={
                  watch?.customerDiscountPercent === "" ||
                  watch?.customerDiscountPercent == null
                    ? ""
                    : String(watch.customerDiscountPercent)
                }
                errors={errors}
                placeholder="0"
                disabled={!isIndividualCollaboration}
                readOnly={!isIndividualCollaboration}
                isRequired={isIndividualCollaboration}
              />
            )}
            {watch?.compensationType === COMPENSATION_TYPE.COMMISSION && !isAffiliateOffer && (
              <CustomInput
                label="Product Price ($)"
                type="number"
                register={register}
                name="productPrice"
                errors={errors}
                placeholder="0"
              />
            )}
          </div>
          {isAffiliateOffer && !isIndividualCollaboration ? (
            <p className="mt-3 text-[10px] text-gray-600 sm:text-xs">
              Shopper discount is fixed for the campaign. Commission rate can be adjusted for this
              creator before you send the offer.
            </p>
          ) : null}
          {isIndividualCollaboration && campaignTypeValue === CAMPAIGN_TYPE.UGC && (
            <p className="mt-3 text-[10px] text-gray-600 sm:text-xs">
              UGC: the creator timeline has two steps (recorded → draft delivery). They are not
              asked to submit a published post link.
            </p>
          )}
        </div>

        {/* Legal & Compliance */}
        <div>
          <h3 className="mb-2 text-sm font-semibold text-gray-900 sm:text-base">
            Legal & Compliance
          </h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
            <div>
              <SimpleSelect
                label="Exclusivity Clause"
                options={HIRE_EXCLUSIVITY_CLAUSE_OPTIONS}
                value={exclusivityOption}
                onChange={(option) =>
                  setValue("exclusivityClause", option?.value || "none", {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
                errors={errors}
                name="exclusivityClause"
              />
            </div>
            <div>
              <SimpleSelect
                label="Usage Rights"
                options={HIRE_USAGE_RIGHTS_OPTIONS}
                value={usageRightsOption}
                onChange={(option) =>
                  setValue("usageRights", option?.value || "no_usage", {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
                errors={errors}
                name="usageRights"
              />
            </div>
          </div>
        </div>

        {/* Additional Clause (Optional) */}
        <div>
          <h3 className="mb-2 text-sm font-semibold text-gray-900 sm:text-base">
            Additional Clause (Optional)
          </h3>
          <div>
            <CustomInput
              label="Clause Title"
              register={register}
              name="additionalClauseTitle"
              errors={errors}
              placeholder="Enter clause title"
            />
          </div>
          <div className="mt-3 w-full sm:mt-4">
            <TextArea
              label="Clause Body"
              register={register}
              name="additionalClauseBody"
              errors={errors}
              placeholder="Enter clause body"
            />
          </div>
          <p className="flex justify-end text-[10px] text-gray-600 sm:text-xs">
            {watch?.additionalClauseBody?.length || 0}/{2000} characters remaining
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 border-t border-gray-200 pt-4 sm:flex-row sm:justify-end sm:gap-3">
          <CustomButton
            text="Save Draft"
            className="btn-outline w-full sm:w-auto"
            type="button"
            onClick={() => {}}
          />
          <CustomButton
            text="Preview Contract"
            className="btn-secondary w-full sm:w-auto"
            type="button"
            onClick={handlePreviewContract}
          />
          <CustomButton
            text="Send Offer"
            className="btn-primary w-full sm:w-auto"
            type="submit"
            loading={isSubmitting}
            disabled={
              isSubmitting ||
              (isPaymentRequired() && !canFundCollaborations) ||
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
