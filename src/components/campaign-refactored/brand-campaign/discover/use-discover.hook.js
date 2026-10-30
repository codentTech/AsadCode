import { CAMPAIGN_STATUS, COLLABORATION_TYPE } from "@/common/constants/campaign.constant";
import { getAllBrandCampaigns } from "@/provider/features/campaigns/campaigns.slice";
import {
  addUserToShortlist,
  addUsersToShortlistBulk,
  createShortlist,
  deleteShortlist,
  getAllShortlists,
  removeUserFromShortlist,
  removeUsersFromShortlistBulk,
  updateShortlist,
} from "@/provider/features/shortlist/shortlist.slice";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { mapUserToCreator } from "@/common/utils/discover-creators.util";

function useDiscover() {
  const dispatch = useDispatch();
  const shortlistState = useSelector((state) => state.shortlist);
  const campaignsState = useSelector((state) => state.campaigns?.getAllBrandCampaigns);
  const isCampaignsLoading = Boolean(campaignsState?.isLoading);
  const saveSuccessCallbackRef = useRef(null);

  const [selectedShortlist, setSelectedShortlist] = useState(null);
  const [isNewShortlistDialogOpen, setIsNewShortlistDialogOpen] = useState(false);
  const [newShortlistName, setNewShortlistName] = useState("");
  const [previewCreator, setPreviewCreator] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [sortOption, setSortOption] = useState("followers");
  const [saveToShortlistDialogOpen, setSaveToShortlistDialogOpen] = useState(false);
  const [creatorsToSave, setCreatorsToSave] = useState([]);
  const [savingShortlistId, setSavingShortlistId] = useState(null);
  const [saveToShortlistResult, setSaveToShortlistResult] = useState(null);
  const [userCampaigns, setUserCampaigns] = useState([]);
  const [shortlistMenuOpen, setShortlistMenuOpen] = useState(false);

  useEffect(() => {
    dispatch(getAllShortlists());
    if (!campaignsState?.isSuccess && !campaignsState?.isLoading && !campaignsState?.isError) {
      dispatch(getAllBrandCampaigns());
    }
  }, [dispatch, campaignsState?.isSuccess, campaignsState?.isLoading, campaignsState?.isError]);

  useEffect(() => {
    if (campaignsState?.data?.data && Array.isArray(campaignsState.data.data)) {
      // Filter out completed campaigns on frontend
      const activeCampaigns = campaignsState.data.data.filter(
        (campaign) =>
          campaign.status !== CAMPAIGN_STATUS.COMPLETE &&
          campaign.collaboration_type !== COLLABORATION_TYPE.INDIVIDUAL_CREATOR
      );
      setUserCampaigns(activeCampaigns);
    }
  }, [campaignsState]);

  useEffect(() => {
    if (!shortlistState.getAllShortlists.data) return;

    if (!selectedShortlist?.id) return;

    const updatedShortlist = shortlistState.getAllShortlists.data.find(
      (s) => s.id === selectedShortlist.id
    );

    if (updatedShortlist) {
      setSelectedShortlist(updatedShortlist);
      return;
    }

    setSelectedShortlist(null);
  }, [shortlistState.getAllShortlists.data, selectedShortlist?.id]);

  useEffect(() => {
    if (!shortlistMenuOpen) return;
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setShortlistMenuOpen(false);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [shortlistMenuOpen]);

  const handleShortlistSelect = useCallback((shortlist) => {
    setSelectedShortlist(shortlist);
    setShortlistMenuOpen(false);
  }, []);

  // Handle new shortlist creation
  const handleCreateShortlist = () => {
    if (newShortlistName.trim()) {
      dispatch(createShortlist({ name: newShortlistName.trim() }));
      setNewShortlistName("");
      setIsNewShortlistDialogOpen(false);
    }
  };

  // Handle creator preview
  const handleCreatorPreview = (creator) => {
    setPreviewCreator(creator);
    setIsPreviewOpen(true);
  };

  const getCreatorDisplayName = (creator) =>
    creator?.name ||
    [creator?.first_name, creator?.last_name].filter(Boolean).join(" ").trim() ||
    "Unknown creator";

  // Handle adding creator(s) to shortlist
  const handleSaveToShortlist = (creatorOrCreators, onSuccess) => {
    const creators = Array.isArray(creatorOrCreators)
      ? creatorOrCreators
      : creatorOrCreators
        ? [creatorOrCreators]
        : [];
    if (creators.length === 0) return;

    saveSuccessCallbackRef.current = onSuccess || null;
    setSaveToShortlistResult(null);
    setCreatorsToSave(creators);
    setSaveToShortlistDialogOpen(true);
  };

  const handleCloseSaveToShortlist = () => {
    if (savingShortlistId) return;
    saveSuccessCallbackRef.current = null;
    setCreatorsToSave([]);
    setSaveToShortlistResult(null);
    setSaveToShortlistDialogOpen(false);
  };

  const resolveCreatorNameById = (creatorId) => {
    const creator = creatorsToSave.find((item) => item.id === creatorId);
    return creator ? getCreatorDisplayName(creator) : creatorId;
  };

  // Confirm adding creator(s) to selected shortlist
  const confirmSaveToShortlist = async (shortlistId) => {
    if (!creatorsToSave.length || savingShortlistId) return;

    setSavingShortlistId(shortlistId);
    setSaveToShortlistResult(null);

    const shortlistName =
      (shortlistState.getAllShortlists.data || []).find((shortlist) => shortlist.id === shortlistId)
        ?.name || "this shortlist";

    let added = [];
    let alreadyIn = [];
    let failed = [];

    if (creatorsToSave.length === 1) {
      const creator = creatorsToSave[0];
      const displayName = getCreatorDisplayName(creator);
      const result = await dispatch(
        addUserToShortlist({
          shortlistId,
          userId: creator.id,
          skipToast: true,
        })
      );

      if (addUserToShortlist.fulfilled.match(result)) {
        added = [displayName];
      } else {
        const errorMessage = String(result.payload?.message || "");
        if (/already in the shortlist/i.test(errorMessage)) {
          alreadyIn = [displayName];
        } else {
          failed = [displayName];
        }
      }
    } else {
      const result = await dispatch(
        addUsersToShortlistBulk({
          shortlistId,
          userIds: creatorsToSave.map((creator) => creator.id),
          skipToast: true,
        })
      );

      if (!addUsersToShortlistBulk.fulfilled.match(result)) {
        failed = creatorsToSave.map(getCreatorDisplayName);
      } else {
        const payload = result.payload || {};
        added = (payload.added || []).map(resolveCreatorNameById);
        alreadyIn = (payload.already_in || []).map(resolveCreatorNameById);
        failed = (payload.not_found || []).map(resolveCreatorNameById);
      }
    }

    if (added.length > 0) {
      const refetchResult = await dispatch(getAllShortlists());

      if (selectedShortlist && selectedShortlist.id === shortlistId) {
        if (refetchResult.type === getAllShortlists.fulfilled.type && refetchResult.payload) {
          const updatedShortlist = refetchResult.payload.find((s) => s.id === shortlistId);
          if (updatedShortlist) {
            setSelectedShortlist(updatedShortlist);
          }
        }
      }
    }

    if (alreadyIn.length === 0 && failed.length === 0) {
      const onSuccess = saveSuccessCallbackRef.current;
      saveSuccessCallbackRef.current = null;
      onSuccess?.();
      setSaveToShortlistDialogOpen(false);
      setCreatorsToSave([]);
      setSavingShortlistId(null);
      return;
    }

    setSaveToShortlistResult({ shortlistName, added, alreadyIn, failed });
    setSavingShortlistId(null);
  };

  // Handle removing creator from shortlist
  const handleRemoveFromShortlist = async (creatorId) => {
    if (!selectedShortlist) return;

    const shortlistId = selectedShortlist.id;
    const result = await dispatch(
      removeUserFromShortlist({
        shortlistId,
        userId: creatorId,
      })
    );

    // Refetch shortlists to get updated counts from backend
    if (result.type === removeUserFromShortlist.fulfilled.type) {
      const refetchResult = await dispatch(getAllShortlists());

      // Update selected shortlist reference
      if (refetchResult.type === getAllShortlists.fulfilled.type && refetchResult.payload) {
        const updatedShortlist = refetchResult.payload.find((s) => s.id === shortlistId);
        if (updatedShortlist) {
          setSelectedShortlist(updatedShortlist);
        } else {
          // If shortlist no longer exists or has no users, clear selection
          setSelectedShortlist(null);
        }
      }
    }
  };

  const handleBulkRemoveFromShortlist = async (creatorIds = []) => {
    if (!selectedShortlist || !creatorIds.length) return false;

    const shortlistId = selectedShortlist.id;
    const result = await dispatch(
      removeUsersFromShortlistBulk({
        shortlistId,
        userIds: creatorIds,
        skipToast: false,
      })
    );

    if (!removeUsersFromShortlistBulk.fulfilled.match(result)) {
      return false;
    }

    const refetchResult = await dispatch(getAllShortlists());
    if (refetchResult.type === getAllShortlists.fulfilled.type && refetchResult.payload) {
      const updatedShortlist = refetchResult.payload.find((s) => s.id === shortlistId);
      if (updatedShortlist) {
        setSelectedShortlist(updatedShortlist);
      } else {
        setSelectedShortlist(null);
      }
    }

    return true;
  };

  // Handle editing shortlist name
  const handleEditShortlist = (shortlistId, newName) => {
    dispatch(
      updateShortlist({
        shortlistId,
        updateData: { name: newName },
      })
    );

    // Update selected shortlist reference optimistically
    if (selectedShortlist && selectedShortlist.id === shortlistId) {
      setSelectedShortlist({ ...selectedShortlist, name: newName });
    }
  };

  // Handle deleting shortlist
  const handleDeleteShortlist = (shortlistId) => {
    dispatch(deleteShortlist(shortlistId));

    // Clear selected shortlist if it was deleted
    if (selectedShortlist && selectedShortlist.id === shortlistId) {
      setSelectedShortlist(null);
    }
  };

  const handleRefreshCampaigns = useCallback(() => {
    dispatch(getAllBrandCampaigns());
  }, [dispatch]);

  // Handle inviting creator to apply
  const handleInviteToApply = (creator, campaign) => {
    // Invite logic would go here
  };

  const transformUserToCreator = (user) => mapUserToCreator(user);

  // Sort creators in the selected shortlist
  const getSortedCreators = () => {
    if (!selectedShortlist || !selectedShortlist.users || !Array.isArray(selectedShortlist.users)) {
      return [];
    }

    const transformedCreators = selectedShortlist.users.map(transformUserToCreator);

    return [...transformedCreators].sort((a, b) => {
      switch (sortOption) {
        case "followers":
          return (b.followers || 0) - (a.followers || 0);
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        case "reviews":
          return (b.reviewCount || 0) - (a.reviewCount || 0);
        case "engagement":
          return (b.engagementRate || 0) - (a.engagementRate || 0);
        default:
          return (b.followers || 0) - (a.followers || 0);
      }
    });
  };

  return {
    shortlists: shortlistState.getAllShortlists.data || [],
    selectedShortlist,
    setSelectedShortlist,
    isNewShortlistDialogOpen,
    setIsNewShortlistDialogOpen,
    newShortlistName,
    setNewShortlistName,
    previewCreator,
    isPreviewOpen,
    setIsPreviewOpen,
    saveToShortlistDialogOpen,
    setSaveToShortlistDialogOpen,
    creatorsToSave,
    savingShortlistId,
    saveToShortlistResult,
    saveToShortlistError: "",
    handleCloseSaveToShortlist,
    handleShortlistSelect,
    handleCreateShortlist,
    handleCreatorPreview,
    handleSaveToShortlist,
    confirmSaveToShortlist,
    getSortedCreators,
    handleRemoveFromShortlist,
    handleBulkRemoveFromShortlist,
    handleEditShortlist,
    handleDeleteShortlist,
    handleInviteToApply,
    handleRefreshCampaigns,
    isCampaignsLoading,
    userCampaigns,
    shortlistState,
    shortlistMenuOpen,
    setShortlistMenuOpen,
  };
}

export default useDiscover;
