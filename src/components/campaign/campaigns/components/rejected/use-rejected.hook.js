import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getRejectedCreators,
  reinstateCreator,
} from "@/provider/features/campaigns/campaigns.slice";
import { addUserToShortlist } from "@/provider/features/shortlist/shortlist.slice";

function useRejected() {
  // State
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [selectedCreator, setSelectedCreator] = useState(null);
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState("newest");
  const autoSelectedForCampaignRef = useRef(null);

  // Redux State
  const dispatch = useDispatch();

  const {
    data: rejectedCreatorsData,
    isLoading: rejectedCreatorsLoading,
    isSuccess: rejectedCreatorsSuccess,
    isError: rejectedCreatorsError,
  } = useSelector((state) => state.campaigns.getRejectedCreators || {});

  const {
    isLoading: rejectLoading,
    isSuccess: rejectSuccess,
    isError: rejectError,
  } = useSelector((state) => state.campaigns.rejectCreator || {});

  const {
    isLoading: reinstateLoading,
    isSuccess: reinstateSuccess,
    isError: reinstateError,
  } = useSelector((state) => state.campaigns.reinstateCreator || {});

  // useEffect
  // Auto-select first creator when creators list loads for the selected campaign
  useEffect(() => {
    const creators = rejectedCreatorsData?.data;

    if (
      selectedCampaign &&
      rejectedCreatorsSuccess &&
      Array.isArray(creators) &&
      creators.length > 0 &&
      !selectedCreator &&
      autoSelectedForCampaignRef.current !== selectedCampaign.id
    ) {
      setSelectedCreator(creators[0]);
      autoSelectedForCampaignRef.current = selectedCampaign.id;
    }
  }, [
    rejectedCreatorsSuccess,
    rejectedCreatorsData,
    selectedCampaign,
    selectedCreator,
    rejectedCreatorsLoading,
    rejectedCreatorsError,
  ]);

  // Listen for reject success from application tab and refresh rejected creators
  useEffect(() => {
    if (rejectSuccess && selectedCampaign) {
      dispatch(
        getRejectedCreators({
          campaignId: selectedCampaign.id,
          filters: { ...filters, status: "REJECTED" },
          sortBy,
        })
      );
    }
  }, [rejectSuccess, selectedCampaign, dispatch, filters, sortBy]);

  // Listen for reinstate success and refresh rejected creators
  useEffect(() => {
    if (reinstateSuccess && selectedCampaign) {
      dispatch(
        getRejectedCreators({
          campaignId: selectedCampaign.id,
          filters: { ...filters, status: "REJECTED" },
          sortBy,
        })
      );
      setSelectedCreator(null);
    }
  }, [reinstateSuccess, selectedCampaign, dispatch, filters, sortBy]);

  // Functions
  const handleCampaignSelect = useCallback(
    (campaign) => {
      setSelectedCampaign(campaign);
      setSelectedCreator(null);
      autoSelectedForCampaignRef.current = null;

      dispatch(
        getRejectedCreators({
          campaignId: campaign.id,
          filters: { ...filters, status: "REJECTED" },
          sortBy,
        })
      );
    },
    [dispatch, filters, sortBy]
  );

  const handleCreatorSelect = useCallback((creator) => {
    setSelectedCreator(creator);
  }, []);

  const handleFilterChange = useCallback(
    (key, value) => {
      const newFilters = { ...filters, [key]: value };
      setFilters(newFilters);

      if (selectedCampaign) {
        dispatch(
          getRejectedCreators({
            campaignId: selectedCampaign.id,
            filters: { ...newFilters, status: "REJECTED" },
            sortBy,
          })
        );
      }
    },
    [filters, selectedCampaign, dispatch, sortBy]
  );

  const handleClearFilters = useCallback(() => {
    setFilters({});
    if (selectedCampaign) {
      dispatch(
        getRejectedCreators({
          campaignId: selectedCampaign.id,
          filters: { status: "REJECTED" },
          sortBy,
        })
      );
    }
  }, [selectedCampaign, dispatch, sortBy]);

  const handleSortChange = useCallback(
    (newSortBy) => {
      setSortBy(newSortBy);
      if (selectedCampaign) {
        dispatch(
          getRejectedCreators({
            campaignId: selectedCampaign.id,
            filters: { ...filters, status: "REJECTED" },
            sortBy: newSortBy,
          })
        );
      }
    },
    [selectedCampaign, dispatch, filters]
  );

  const handleReinstateCreator = useCallback(
    (campaignId, creatorId) => {
      dispatch(reinstateCreator({ campaignId, creatorId }));
    },
    [dispatch]
  );

  const handleSaveToShortlist = useCallback(
    (creator, shortlistId) => {
      dispatch(
        addUserToShortlist({
          shortlistId,
          userId: creator.id,
        })
      );
    },
    [dispatch]
  );

  const creators = Array.isArray(rejectedCreatorsData?.data) ? rejectedCreatorsData.data : [];

  return {
    // State
    selectedCampaign,
    selectedCreator,
    filters,
    sortBy,
    creators,

    // Loading states
    rejectedCreatorsLoading,
    reinstateLoading,

    // Data
    rejectedCreatorsData,

    // Handlers
    handleCampaignSelect,
    handleCreatorSelect,
    handleFilterChange,
    handleClearFilters,
    handleSortChange,
    handleReinstateCreator,
    handleSaveToShortlist,
  };
}

export default useRejected;
