import { isCreatorMode } from "@/common/utils/users.util";
import { getHiredCreators } from "@/provider/features/campaigns/campaigns.slice";
import { CAMPAIGN_TYPE, COLLABORATION_TYPE } from "@/common/constants/campaign.constant";
import { setSelectedCampaign as setSelectedCampaignContext } from "@/provider/features/campaign-context/campaign-context.slice";
import { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import CampaignOverview from "./components/campaign-overview/campaign-overview.component";
import CreatorSpendAnalysis from "./components/creator-spend-analysis/creator-spend-analysis.component";
import DeliverablesProgress from "./components/deliverables-progress/deliverables-progress.component";
import { getIndividualCollaborationContracts } from "@/provider/features/contracts/contracts.slice";

function ActiveBrandCampaign() {
  const dispatch = useDispatch();
  const { selectedCampaignId } = useSelector(
    (state) => state.campaignContext || {}
  );
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [selectedCreator, setSelectedCreator] = useState(null);
  const [isMultiCreator, setIsMultiCreator] = useState(true);
  const [filters, setFilters] = useState({
    status: "HIRED",
    sort: "newest",
  });
  const initialLoadRef = useRef(false);

  useEffect(() => {
    if (!initialLoadRef.current && selectedCampaignId) {
      initialLoadRef.current = true;
    }
  }, [selectedCampaignId]);

  useEffect(() => {
    if (!isMultiCreator) {
      dispatch(getIndividualCollaborationContracts(false));
    }
  }, [isMultiCreator, dispatch]);

  const handleCampaignSelect = (campaign) => {
    setSelectedCampaign(campaign);
    setSelectedCreator(null);
    autoSelectedForCampaignRef.current = null;
    
    if (campaign) {
      dispatch(
        setSelectedCampaignContext({
          campaignId: campaign.id || null,
          collaborationType: campaign.collaboration_type || null,
        })
      );
    } else {
      dispatch(
        setSelectedCampaignContext({
          campaignId: null,
          collaborationType: null,
        })
      );
    }
    
    if (campaign?.collaboration_type === COLLABORATION_TYPE.INDIVIDUAL_CREATOR) {
      return;
    }
    
    const isPaidCampaign = 
      campaign?.campaign_type === CAMPAIGN_TYPE.SPONSORED_POST || 
      campaign?.campaign_type === CAMPAIGN_TYPE.UGC;
    const isGiftedOrAffiliate = 
      campaign?.campaign_type === CAMPAIGN_TYPE.GIFTED || 
      campaign?.campaign_type === CAMPAIGN_TYPE.AFFILIATE;
    
    let defaultSort = "newest";
    if (isPaidCampaign) {
      defaultSort = "most-expensive";
    } else if (isGiftedOrAffiliate) {
      defaultSort = "newest";
    }
    
    const updatedFilters = {
      ...filters,
      sort: filters.sort || defaultSort,
    };
    setFilters(updatedFilters);

    if (campaign?.id) {
      dispatch(
        getHiredCreators({
          campaignId: campaign.id,
          filters: updatedFilters,
        })
      );
    }
  };

  const handleCreatorSelect = (creator) => {
    setSelectedCreator(creator);
    
    if (!isMultiCreator && creator?.campaign_id && !selectedCampaign) {
      const individualCampaign = {
        id: creator.campaign_id,
        collaboration_type: COLLABORATION_TYPE.INDIVIDUAL_CREATOR,
        campaign_title: creator.campaign?.campaign_title || "Individual Collaboration",
        campaign: creator.campaign,
        created_by: creator.campaign?.created_by,
        brand: creator.campaign?.created_by,
      };
      setSelectedCampaign(individualCampaign);
      dispatch(
        setSelectedCampaignContext({
          campaignId: individualCampaign.id,
          collaborationType: COLLABORATION_TYPE.INDIVIDUAL_CREATOR,
        })
      );
    }
  };

  const {
    data: individualContractsData,
    isSuccess: individualContractsSuccess,
  } = useSelector((state) => state.contracts.getIndividualCollaborationContracts || {});

  const autoSelectedForCampaignRef = useRef(null);

  useEffect(() => {
    if (
      selectedCampaign &&
      selectedCampaign.collaboration_type === COLLABORATION_TYPE.INDIVIDUAL_CREATOR &&
      individualContractsSuccess &&
      Array.isArray(individualContractsData) &&
      !selectedCreator
    ) {
      const matchingContracts = individualContractsData.filter(
        (contract) => {
          const contractCampaignId = contract.campaignId || contract.campaign?.id;
          if (contractCampaignId !== selectedCampaign.id) {
            return false;
          }
          const now = new Date();
          const deadline = new Date(contract.completionDeadline || contract.completion_deadline);
          return deadline >= now && contract.campaign?.status !== "COMPLETE";
        }
      );

      if (matchingContracts.length > 0) {
        const firstContract = matchingContracts[0];
        const creator = firstContract.creator;
        const creatorProfile = creator?.creator_profile;

        const formattedCreator = {
          id: firstContract.id,
          contractId: firstContract.id,
          campaign_id: firstContract.campaignId || firstContract.campaign?.id,
          campaign: firstContract.campaign,
          creatorUserId: creator?.id,
          creator: creator,
          name: `${creator?.first_name || ""} ${creator?.last_name || ""}`.trim() || "Unknown Creator",
          bio: creatorProfile?.bio || "No bio available",
          image: creatorProfile?.profile_photo_url,
          location: `${creator?.city || ""}, ${creator?.country || ""}`.replace(/^,\s*|,\s*$/g, "") || "Location not specified",
          rating: creatorProfile?.rating || 0,
          age: creator?.date_of_birth ? new Date().getFullYear() - new Date(creator.date_of_birth).getFullYear() : null,
          contract: firstContract,
        };

        if (formattedCreator.creator) {
          setSelectedCreator(formattedCreator);
          autoSelectedForCampaignRef.current = selectedCampaign.id;
        }
      } else {
        autoSelectedForCampaignRef.current = selectedCampaign.id;
      }
    }
  }, [
    selectedCampaign?.id,
    selectedCampaign?.collaboration_type,
    individualContractsData,
    individualContractsSuccess,
    selectedCreator,
  ]);

  const handleClearCreator = useCallback(() => {
    setSelectedCreator(null);
    autoSelectedForCampaignRef.current = null;
  }, []);

  const handleFilterChange = (filterName, value) => {
    const newFilters = { ...filters, [filterName]: value };
    setFilters(newFilters);

    if (selectedCampaign?.id && selectedCampaign?.collaboration_type !== COLLABORATION_TYPE.INDIVIDUAL_CREATOR) {
      dispatch(
        getHiredCreators({
          campaignId: selectedCampaign.id,
          filters: newFilters,
        })
      );
    }
  };

  const handleSortChange = (sortValue) => {
    handleFilterChange("sort", sortValue);
  };

  const handleToggleChange = (newIsMultiCreator) => {
    setIsMultiCreator(newIsMultiCreator);
    setSelectedCampaign(null);
    setSelectedCreator(null);
  };

  return (
    <div className="relative flex">
      <CampaignOverview 
        onCampaignSelect={handleCampaignSelect}
        onToggleChange={handleToggleChange}
      />

      <CreatorSpendAnalysis
        selectedCampaign={selectedCampaign}
        selectedCreator={selectedCreator}
        onCreatorSelect={handleCreatorSelect}
        onClearCreator={handleClearCreator}
        onSortChange={handleSortChange}
        currentSort={filters.sort}
        isMultiCreator={isMultiCreator}
        isCompleted={false}
      />

      <DeliverablesProgress
        isCreatorMode={isCreatorMode()}
        selectedCampaign={selectedCampaign}
        selectedCreator={selectedCreator}
        isIndividualCreator={!isMultiCreator || selectedCampaign?.collaboration_type === COLLABORATION_TYPE.INDIVIDUAL_CREATOR}
        onClearCreator={handleClearCreator}
        filters={filters}
      />
    </div>
  );
}

export default ActiveBrandCampaign;
