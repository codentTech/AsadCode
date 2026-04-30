import React from "react";
import Modal from "@/common/components/modal/modal.component";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import ContractPreviewModal from "@/components/campaign-refactored/brand-campaign/applications/components/contract-preview-modal/contract-preview-modal.component";
import { avatar } from "@/common/constants/auth.constant";
import { Clock, CreditCard, AlertCircle } from "lucide-react";
import Loader from "@/common/components/loader/loader.component";
import {
  getBrandDisplayNameForBrandUser,
  getBrandLogoUrlFromBrandUser,
} from "@/common/utils/brand-display.util";
import useOffersModal from "./use-offers-modal.hook";

export default function OffersModal({ show, onClose, onContractAction }) {
  const {
    user,
    pendingContracts,
    pendingContractsLoading,
    selectedContract,
    showContractPreview,
    contractPreviewData,
    signLoading,
    declineLoading,
    showStripePrompt,
    formatTimeAgo,
    handleReviewContract,
    handleAccept,
    handleDecline,
    handleBackToList,
    handleSetupStripe,
  } = useOffersModal({ show, onClose, onContractAction });

  // Stripe Setup Prompt Modal
  if (showStripePrompt) {
    return (
      <Modal
        title="Stripe Account Required"
        show={showStripePrompt}
        onClose={handleBackToList}
        size="md"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-yellow-900 mb-1">Payment Setup Required</h3>
              <p className="text-sm text-yellow-800">
                This is a paid collaboration. You need to connect your Stripe account to receive
                payments before accepting this offer.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <CreditCard className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-900 mb-1">Why Stripe?</p>
                <p className="text-sm text-gray-600">
                  Stripe securely handles your payout information and identity verification.
                  CleerCut never stores your bank details.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-2 border-t border-gray-200 pt-4 sm:flex-row sm:justify-end sm:gap-3">
            <CustomButton
              text="Cancel"
              className="btn-outline w-full sm:w-auto sm:px-6"
              onClick={handleBackToList}
            />
            <CustomButton
              text="Set Up Stripe"
              className="btn-primary w-full sm:w-auto sm:px-6"
              onClick={handleSetupStripe}
            />
          </div>
        </div>
      </Modal>
    );
  }

  if (showContractPreview && contractPreviewData) {
    const brand = contractPreviewData.brand;
    const campaign = contractPreviewData.campaign;

    return (
      <ContractPreviewModal
        show={showContractPreview}
        onClose={handleBackToList}
        contractData={{
          brandName: getBrandDisplayNameForBrandUser(brand),
          creatorName:
            user?.first_name && user?.last_name
              ? `${user.first_name} ${user.last_name}`
              : user?.first_name || "Creator",
          campaignTitle: campaign?.campaign_title || "Campaign",
          startDate: contractPreviewData.startDate,
          completionDeadline: contractPreviewData.completionDeadline,
          contentFormat: contractPreviewData.contentFormat,
          revisionsLimit: contractPreviewData.revisionsLimit?.toString() || "2",
          compensationType: contractPreviewData.compensationType,
          totalCompensation: contractPreviewData.totalCompensation?.toString(),
          productPrice: contractPreviewData.productPrice?.toString(),
          productValue: campaign?.product_value?.toString(),
          usageRights: contractPreviewData.usageRights,
          exclusivityClause: contractPreviewData.exclusivityClause,
          hashtags: contractPreviewData.hashtags,
          mentions: contractPreviewData.mentions,
        }}
        creatorData={user}
        campaignData={campaign}
        contractId={contractPreviewData.id}
        customActions={
          <div className="mt-4 flex flex-col-reverse gap-2 border-t border-gray-200 pt-4 sm:flex-row sm:justify-end sm:gap-3">
            <CustomButton
              text="Decline"
              className="btn-outline w-full sm:w-auto sm:px-6"
              onClick={handleDecline}
              disabled={declineLoading}
            />
            <CustomButton
              text="Accept"
              className="btn-primary w-full sm:w-auto sm:px-6"
              onClick={handleAccept}
              disabled={signLoading}
            />
          </div>
        }
      />
    );
  }

  return (
    <Modal title={`My Offers (${pendingContracts.length})`} show={show} onClose={onClose} size="lg">
      <div className="space-y-4">
        {pendingContractsLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader />
          </div>
        ) : pendingContracts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">You don't have any pending offers at the moment.</p>
          </div>
        ) : (
          <div className="max-h-[500px] space-y-3 overflow-y-auto">
            {pendingContracts.map((contract) => {
              const brand = contract.brand;
              const campaign = contract.campaign;
              const brandName = getBrandDisplayNameForBrandUser(brand);
              const brandImage = getBrandLogoUrlFromBrandUser(brand) || avatar;

              return (
                <div
                  key={contract.id}
                  className="rounded-lg border border-gray-200 bg-white p-3 transition-shadow hover:shadow-md sm:p-4"
                >
                  <div className="flex items-start gap-3 sm:gap-4">
                    {/* Brand Image */}
                    <img
                      src={brandImage}
                      alt={brandName}
                      className="h-10 w-10 flex-shrink-0 rounded-lg object-cover sm:h-12 sm:w-12"
                    />

                    <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-sm font-semibold text-gray-900">{brandName}</h3>
                            <p className="mt-1 text-[10px] text-gray-600 sm:text-sm">
                              {campaign?.campaign_title || "Campaign"}
                            </p>
                          </div>
                        </div>

                        {/* Timestamp */}
                        <div className="mb-1 flex items-center gap-1 text-[10px] text-gray-500 sm:mb-3 sm:text-xs">
                          <Clock className="w-3 h-3" />
                          <span>
                            Invited {formatTimeAgo(contract.sentAt || contract.createdAt)}
                          </span>
                        </div>
                      </div>

                      <div>
                        {/* CTA Button */}
                        <CustomButton
                          text="Review Contract"
                          className="btn-primary w-full sm:w-auto"
                          onClick={() => handleReviewContract(contract)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Modal>
  );
}
