import { isCreatorMode } from "@/common/utils/users.util";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  rejectCreator,
  getAppliedCreators,
  createContract,
  sendContract,
} from "@/provider/features/campaigns/campaigns.slice";
import CreatorSpendAnalysis from "./components/creator-spend-analysis/creator-spend-analysis.component";
import DeliverablesProgress from "./components/deliverables-progress/deliverables-progress.component.jsx";
import HireCreatorModal from "./components/hire-creator-modal/hire-creator-modal.component";
import ConfirmationDialog from "@/common/components/custom-dialog-confirmation/ConfirmationDialog";
import Modal from "@/common/components/modal/modal.component";
import TextArea from "@/common/components/text-area/text-area.component";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import MessageThreadModal from "../../message-thread-modal/message-thread-modal.component";
import { avatar } from "@/common/constants/auth.constant";

function BrandApplications() {
  const dispatch = useDispatch();

  // Get Redux state for applied creators
  const {
    data: appliedCreatorsData,
    isLoading: appliedCreatorsLoading,
    isSuccess: appliedCreatorsSuccess,
    isError: appliedCreatorsError,
  } = useSelector((state) => state.campaigns.getAppliedCreators || {});

  // Get Redux state for reject creator
  const {
    isLoading: rejectLoading,
    isSuccess: rejectSuccess,
    isError: rejectError,
  } = useSelector((state) => state.campaigns.rejectCreator || {});

  // State to manage data flow between components
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [selectedCreator, setSelectedCreator] = useState(null);
  const autoSelectedForCampaignRef = useRef(null);
  const [hireModalOpen, setHireModalOpen] = useState(false);
  const [hireCreatorData, setHireCreatorData] = useState(null);
  const [selectedCampaignForHire, setSelectedCampaignForHire] = useState(null);
  const [showRejectConfirmation, setShowRejectConfirmation] = useState(false);
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);

  // Contract creation/sending state
  const {
    isLoading: createContractLoading,
    isSuccess: createContractSuccess,
    isError: createContractError,
  } = useSelector((state) => state.campaigns.createContract || {});
  const {
    isLoading: sendContractLoading,
    isSuccess: sendContractSuccess,
    isError: sendContractError,
  } = useSelector((state) => state.campaigns.sendContract || {});
  const [filters, setFilters] = useState({
    min_followers: "",
    max_followers: "",
    min_rating: "",
    max_rating: "",
    country: "",
    city: "",
    niches: [],
    platforms: [],
    status: "PENDING", // Default to PENDING applications
    sort: "newest",
  });

  // Handle campaign selection from CampaignOverview
  const handleCampaignSelect = (campaign) => {
    console.log("Refreshing campaign data for:", campaign.id);
    setSelectedCampaign(campaign);
    setSelectedCreator(null); // Reset selected creator when campaign changes
    autoSelectedForCampaignRef.current = null; // reset auto-select guard for new campaign

    // Fetch applied creators for this campaign
    dispatch(
      getAppliedCreators({
        campaignId: campaign.id,
        filters: filters,
      })
    );
  };

  // Auto-select first creator when creators list loads for the selected campaign
  useEffect(() => {
    const creators = appliedCreatorsData?.data;
    if (
      selectedCampaign &&
      appliedCreatorsSuccess &&
      Array.isArray(creators) &&
      creators.length > 0 &&
      !selectedCreator &&
      autoSelectedForCampaignRef.current !== selectedCampaign.id
    ) {
      setSelectedCreator(creators[0]);
      autoSelectedForCampaignRef.current = selectedCampaign.id;
    }
  }, [appliedCreatorsSuccess, appliedCreatorsData, selectedCampaign, selectedCreator]);

  // Handle creator selection from CreatorSpendAnalysis
  const handleCreatorSelect = (creator) => {
    setSelectedCreator(creator);
  };

  // Actions: Hire / Reject / Message
  const handleHireClick = () => {
    if (!selectedCreator || !selectedCampaign) return;
    setHireCreatorData(selectedCreator);
    setSelectedCampaignForHire(selectedCampaign);
    setHireModalOpen(true);
  };

  const handleSendOffer = async (contractData) => {
    // Prepare payload (aligns with previous implementation)
    const contractPayload = {
      campaignId: selectedCampaign.id,
      creatorId: selectedCreator.creator?.id || selectedCreator.id,
      brandId: selectedCampaign.created_by?.id,
      startDate: contractData.startDate,
      completionDeadline: contractData.completionDeadline,
      contentFormat: contractData.contentFormat,
      revisionsLimit: contractData.revisionsLimit,
      compensationType: contractData.compensationType?.toLowerCase(),
      totalCompensation: contractData.totalCompensation
        ? parseFloat(contractData.totalCompensation)
        : undefined,
      productPrice: contractData.productPrice ? parseFloat(contractData.productPrice) : undefined,
      usageRights:
        contractData.usageRights === "no_usage"
          ? "no_usage"
          : contractData.usageRights === "permanent"
            ? "permanent"
            : `${contractData.usageRights}_months`,
      exclusivityClause:
        contractData.exclusivityClause === "none"
          ? "none"
          : `${contractData.exclusivityClause}_months`,
      hashtags: contractData.hashtags,
      mentions: contractData.mentions,
      inPersonRequired: contractData.inPersonRequired,
      eligibleCountry: contractData.eligibleCountry,
      eligibleCity: contractData.eligibleCity,
      ageRange: contractData.ageRange,
      gender: contractData.gender,
      language: contractData.language,
    };

    const createResult = await dispatch(createContract(contractPayload)).unwrap();
    if (createResult.success) {
      await dispatch(sendContract(createResult.data.id)).unwrap();
      setHireModalOpen(false);
      setHireCreatorData(null);
      setSelectedCampaignForHire(null);
      setTimeout(() => {
        if (selectedCampaign) {
          handleCampaignSelect(selectedCampaign);
        }
      }, 1000);
    }
  };

  const handleRejectClick = () => setShowRejectConfirmation(true);
  const handleConfirmReject = () => {
    if (selectedCampaign && selectedCreator) {
      dispatch(rejectCreator({ campaignId: selectedCampaign.id, creatorId: selectedCreator.id }));
    }
    setShowRejectConfirmation(false);
  };

  // Handle filter changes from CampaignOverview
  const handleFilterChange = (filterName, value) => {
    const newFilters = { ...filters, [filterName]: value };
    setFilters(newFilters);

    // Refetch creators with new filters if campaign is selected
    if (selectedCampaign) {
      dispatch(
        getAppliedCreators({
          campaignId: selectedCampaign.id,
          filters: newFilters,
        })
      );
    }
  };

  const clearFilters = () => {
    const clearedFilters = {
      min_followers: "",
      max_followers: "",
      min_rating: "",
      max_rating: "",
      country: "",
      city: "",
      niches: [],
      platforms: [],
      status: "PENDING", // Reset to PENDING when clearing filters
      sort: "newest",
    };
    setFilters(clearedFilters);

    // Refetch creators with cleared filters if campaign is selected
    if (selectedCampaign) {
      dispatch(
        getAppliedCreators({
          campaignId: selectedCampaign.id,
          filters: clearedFilters,
        })
      );
    }
  };

  // Handle reject creator
  const handleRejectCreator = (campaignId, creatorId) => {
    dispatch(rejectCreator({ campaignId, creatorId }));
  };

  // Handle reject success - refresh the applied creators list
  useEffect(() => {
    if (rejectSuccess && selectedCampaign) {
      // Refresh the applied creators list to remove the rejected creator
      dispatch(
        getAppliedCreators({
          campaignId: selectedCampaign.id,
          filters: { ...filters, status: "PENDING" },
        })
      );
      // Reset selected creator since they're no longer in the list
      setSelectedCreator(null);
    }
  }, [rejectSuccess, selectedCampaign, dispatch, filters]);

  const creator = {
    id: selectedCreator?.creator?.id,
    name: selectedCreator?.creator?.first_name + " " + selectedCreator?.creator?.last_name,
    avatar,
    isOnline: true,
  };

  return (
    <div className="relative flex">
      <CreatorSpendAnalysis
        onCampaignSelect={handleCampaignSelect}
        selectedCampaign={selectedCampaign}
        appliedCreatorsData={appliedCreatorsData}
        appliedCreatorsLoading={appliedCreatorsLoading}
        onCreatorSelect={handleCreatorSelect}
        selectedCreator={selectedCreator}
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={clearFilters}
        onMessageClick={() => setMessageDialogOpen(true)}
      />

      <DeliverablesProgress
        isCreatorMode={isCreatorMode()}
        selectedCampaign={selectedCampaign}
        selectedCreator={selectedCreator}
        onHireClick={handleHireClick}
        onRejectClick={handleRejectClick}
        onMessageClick={() => setMessageDialogOpen(true)}
      />

      {/* Hire Creator Modal */}
      <HireCreatorModal
        show={hireModalOpen}
        onClose={() => setHireModalOpen(false)}
        creatorData={hireCreatorData}
        campaignData={selectedCampaignForHire}
        onSendOffer={handleSendOffer}
        isLoading={createContractLoading || sendContractLoading}
        isSuccess={createContractSuccess && sendContractSuccess}
        isError={createContractError || sendContractError}
      />

      <MessageThreadModal
        isOpen={messageDialogOpen}
        onClose={() => setMessageDialogOpen(false)}
        creator={creator}
      />

      {/* Reject Confirmation Modal */}
      <ConfirmationDialog
        show={showRejectConfirmation}
        onClose={() => setShowRejectConfirmation(false)}
        onConfirm={handleConfirmReject}
        message="Reject Creator"
        content={
          <div className="text-center">
            <p className="text-gray-600 mb-2">
              Are you sure you want to reject this creator's application?
            </p>
            <p className="text-sm text-gray-500">
              This action will move the application to the rejected list.
            </p>
          </div>
        }
      />
    </div>
  );
}

export default BrandApplications;
