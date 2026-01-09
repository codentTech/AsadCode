import { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import CampaignOverviewCompleted from "./components/campaign-overview/campaign-overview.component";
import CreatorSpendAnalysisCompleted from "./components/creator-spend-analysis/creator-spend-analysis.component";
import DeliverablesProgressCompleted from "./components/deliverables-progress/deliverables-progress.component";
import { COLLABORATION_TYPE } from "@/common/constants/campaign.constant";
import { setSelectedCampaign as setSelectedCampaignContext } from "@/provider/features/campaign-context/campaign-context.slice";
import { getIndividualCollaborationContracts } from "@/provider/features/contracts/contracts.slice";
import { getAppliedCreators } from "@/provider/features/campaigns/campaigns.slice";

function CompletedBrandCampaign() {
  const dispatch = useDispatch();
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [selectedCreator, setSelectedCreator] = useState(null);
  const [isMultiCreator, setIsMultiCreator] = useState(true);
  const autoSelectedForCampaignRef = useRef(null);

  useEffect(() => {
    if (!isMultiCreator) {
      dispatch(getIndividualCollaborationContracts(true));
    }
  }, [isMultiCreator, dispatch]);

  useEffect(() => {
    if (
      selectedCampaign &&
      selectedCampaign.collaboration_type !== COLLABORATION_TYPE.INDIVIDUAL_CREATOR &&
      selectedCampaign.id
    ) {
      dispatch(
        getAppliedCreators({
          campaignId: selectedCampaign.id,
          filters: { status: "COMPLETED" },
        })
      );
    }
  }, [selectedCampaign?.id, selectedCampaign?.collaboration_type, dispatch]);

  const {
    data: individualContractsData,
    isSuccess: individualContractsSuccess,
    isLoading: individualContractsLoading,
  } = useSelector((state) => state.contracts.getIndividualCollaborationContracts || {});

  const {
    data: creatorsData,
    isSuccess: creatorsSuccess,
    isLoading: creatorsLoading,
  } = useSelector((state) => state.campaigns.getAppliedCreators || {});

  const handleCampaignSelect = useCallback(
    (campaign) => {
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

      if (campaign?.id) {
        dispatch(
          getAppliedCreators({
            campaignId: campaign.id,
            filters: { status: "COMPLETED" },
          })
        );
      }
    },
    [dispatch]
  );

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

  useEffect(() => {
    if (
      isMultiCreator &&
      selectedCampaign &&
      selectedCampaign.collaboration_type !== COLLABORATION_TYPE.INDIVIDUAL_CREATOR &&
      creatorsSuccess &&
      Array.isArray(creatorsData?.data) &&
      creatorsData.data.length > 0 &&
      !selectedCreator &&
      autoSelectedForCampaignRef.current !== selectedCampaign.id
    ) {
      const firstCreator = creatorsData.data[0];
      const creatorProfile = firstCreator.creator?.creator_profile;

      const formattedCreator = {
        id: firstCreator.id,
        campaign_id: firstCreator.campaign_id,
        creatorUserId: firstCreator.creator?.id,
        creator: firstCreator.creator,
        name:
          `${firstCreator.creator?.first_name || ""} ${firstCreator.creator?.last_name || ""}`.trim() ||
          "Unknown Creator",
        bio: creatorProfile?.bio || "No bio available",
        image: creatorProfile?.profile_photo_url,
        location:
          `${firstCreator.creator?.city || ""}, ${firstCreator.creator?.country || ""}`.replace(
            /^,\s*|,\s*$/g,
            ""
          ) || "Location not specified",
        rating: creatorProfile?.rating || 0,
        reviewCount: creatorProfile?.review_count || 0,
        age: firstCreator.creator?.date_of_birth
          ? new Date().getFullYear() - new Date(firstCreator.creator.date_of_birth).getFullYear()
          : null,
      };

      setSelectedCreator(formattedCreator);
      autoSelectedForCampaignRef.current = selectedCampaign.id;
    }
  }, [
    isMultiCreator,
    selectedCampaign?.id,
    selectedCampaign?.collaboration_type,
    creatorsData,
    creatorsSuccess,
    selectedCreator,
  ]);

  useEffect(() => {
    if (
      selectedCampaign &&
      selectedCampaign.collaboration_type === COLLABORATION_TYPE.INDIVIDUAL_CREATOR &&
      individualContractsSuccess &&
      Array.isArray(individualContractsData) &&
      individualContractsData.length > 0 &&
      !selectedCreator &&
      autoSelectedForCampaignRef.current !== (selectedCampaign.id || selectedCampaign.campaign?.id)
    ) {
      const campaignId = selectedCampaign.id || selectedCampaign.campaign?.id;

      const matchingContracts = individualContractsData.filter((contract) => {
        const contractCampaignId = contract.campaignId || contract.campaign?.id;
        return contractCampaignId === campaignId && contract.campaign?.status === "COMPLETE";
      });

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
          name:
            `${creator?.first_name || ""} ${creator?.last_name || ""}`.trim() || "Unknown Creator",
          bio: creatorProfile?.bio || "No bio available",
          image: creatorProfile?.profile_photo_url,
          location:
            `${creator?.city || ""}, ${creator?.country || ""}`.replace(/^,\s*|,\s*$/g, "") ||
            "Location not specified",
          rating: creatorProfile?.rating || 0,
          age: creator?.date_of_birth
            ? new Date().getFullYear() - new Date(creator.date_of_birth).getFullYear()
            : null,
          contract: firstContract,
        };

        setSelectedCreator(formattedCreator);
        autoSelectedForCampaignRef.current = campaignId;
      } else {
        autoSelectedForCampaignRef.current = campaignId;
      }
    }
  }, [
    selectedCampaign?.id,
    selectedCampaign?.collaboration_type,
    individualContractsData,
    individualContractsSuccess,
    selectedCreator,
  ]);

  const handleToggleChange = (newIsMultiCreator) => {
    setIsMultiCreator(newIsMultiCreator);
    setSelectedCampaign(null);
    setSelectedCreator(null);
    autoSelectedForCampaignRef.current = null;
  };

  const handleSortChange = (sortValue) => {
    if (
      selectedCampaign?.id &&
      selectedCampaign?.collaboration_type !== COLLABORATION_TYPE.INDIVIDUAL_CREATOR
    ) {
      dispatch(
        getAppliedCreators({
          campaignId: selectedCampaign.id,
          filters: { status: "COMPLETED", sort: sortValue },
        })
      );
    }
  };

  const isIndividualCreator =
    !isMultiCreator ||
    selectedCampaign?.collaboration_type === COLLABORATION_TYPE.INDIVIDUAL_CREATOR;
  const isLoading = isIndividualCreator ? individualContractsLoading : creatorsLoading;

  return (
    <div className="relative flex">
      <CampaignOverviewCompleted
        onCampaignSelect={handleCampaignSelect}
        onToggleChange={handleToggleChange}
        parentSelectedCampaign={selectedCampaign}
      />

      <CreatorSpendAnalysisCompleted
        selectedCampaign={selectedCampaign}
        selectedCreator={selectedCreator}
        onCreatorSelect={handleCreatorSelect}
        onSortChange={handleSortChange}
        currentSort="newest"
        isMultiCreator={isMultiCreator}
        isCompleted={true}
      />

      <DeliverablesProgressCompleted
        selectedCampaign={selectedCampaign}
        selectedCreator={selectedCreator}
        isIndividualCreator={isIndividualCreator}
        isLoading={isLoading}
      />
    </div>
  );
}

export default CompletedBrandCampaign;
