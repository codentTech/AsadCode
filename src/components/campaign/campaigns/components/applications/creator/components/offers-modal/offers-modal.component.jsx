import React from "react";
import Modal from "@/common/components/modal/modal.component";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import ContractPreviewModal from "../../../brand/components/contract-preview-modal/contract-preview-modal.component";
import { avatar } from "@/common/constants/auth.constant";
import { Clock } from "lucide-react";
import Loader from "@/common/components/loader/loader.component";
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
    formatTimeAgo,
    handleReviewContract,
    handleAccept,
    handleDecline,
    handleBackToList,
  } = useOffersModal({ show, onClose, onContractAction });

  // If showing contract preview
  if (showContractPreview && contractPreviewData) {
    const brand = contractPreviewData.brand;
    const campaign = contractPreviewData.campaign;

    return (
      <ContractPreviewModal
        show={showContractPreview}
        onClose={handleBackToList}
        contractData={{
          brandName:
            brand?.first_name && brand?.last_name
              ? `${brand.first_name} ${brand.last_name}`
              : brand?.first_name || "Brand",
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
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 mt-4">
            <CustomButton
              text="Decline"
              className="btn-outline px-6 py-2"
              onClick={handleDecline}
              disabled={declineLoading}
            />
            <CustomButton
              text="Accept"
              className="btn-primary px-6 py-2"
              onClick={handleAccept}
              disabled={signLoading}
            />
          </div>
        }
      />
    );
  }

  return (
    <Modal title="My Offers" show={show} onClose={onClose} size="lg">
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
          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {pendingContracts.map((contract) => {
              const brand = contract.brand;
              const campaign = contract.campaign;
              const brandName =
                brand?.first_name && brand?.last_name
                  ? `${brand.first_name} ${brand.last_name}`
                  : brand?.first_name || "Brand";
              const brandImage = brand?.brand_profile?.logo || avatar;

              return (
                <div
                  key={contract.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start space-x-4">
                    {/* Brand Image */}
                    <img
                      src={brandImage}
                      alt={brandName}
                      className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                    />

                    <div className="w-full flex justify-between items-start">
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-sm font-semibold text-gray-900">{brandName}</h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {campaign?.campaign_title || "Campaign"}
                            </p>
                          </div>
                        </div>

                        {/* Timestamp */}
                        <div className="flex items-center space-x-1 text-xs text-gray-500 mb-3">
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
                          className="btn-primary w-full"
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
