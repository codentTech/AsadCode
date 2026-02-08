import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createShortlist,
  getAllShortlists,
  updateShortlist,
  deleteShortlist,
  addUserToShortlist,
  removeUserFromShortlist,
} from "@/provider/features/shortlist/shortlist.slice";
import { getAllBrandCampaigns } from "@/provider/features/campaigns/campaigns.slice";

function useDiscover() {
  const dispatch = useDispatch();
  const shortlistState = useSelector((state) => state.shortlist);
  const campaignsState = useSelector(
    (state) => state.campaigns?.getAllBrandCampaigns
  );

  const [selectedShortlist, setSelectedShortlist] = useState(null);
  const [isNewShortlistDialogOpen, setIsNewShortlistDialogOpen] = useState(false);
  const [newShortlistName, setNewShortlistName] = useState("");
  const [previewCreator, setPreviewCreator] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [sortOption, setSortOption] = useState("followers");
  const [saveToShortlistDialogOpen, setSaveToShortlistDialogOpen] = useState(false);
  const [creatorToSave, setCreatorToSave] = useState(null);
  const [userCampaigns, setUserCampaigns] = useState([]);

  useEffect(() => {
    dispatch(getAllShortlists());
    dispatch(getAllBrandCampaigns());
  }, [dispatch]);

  useEffect(() => {
    if (campaignsState?.data?.data && Array.isArray(campaignsState.data.data)) {
      // Filter out completed campaigns on frontend
      const activeCampaigns = campaignsState.data.data.filter(
        (campaign) => campaign.status !== "COMPLETE"
      );
      setUserCampaigns(activeCampaigns);
    }
  }, [campaignsState]);

  // Update the selected shortlist when shortlists change
  useEffect(() => {
    if (selectedShortlist?.id && shortlistState.getAllShortlists.data) {
      const updatedShortlist = shortlistState.getAllShortlists.data.find(
        (s) => s.id === selectedShortlist.id
      );
      if (updatedShortlist) {
        setSelectedShortlist(updatedShortlist);
      }
    }
  }, [shortlistState.getAllShortlists.data]);

  // Handle shortlist selection
  const handleShortlistSelect = (shortlist) => {
    setSelectedShortlist(shortlist);
  };

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

  // Handle adding creator to shortlist
  const handleSaveToShortlist = (creator) => {
    setCreatorToSave(creator);
    setSaveToShortlistDialogOpen(true);
  };

  // Confirm adding creator to selected shortlist
  const confirmSaveToShortlist = async (shortlistId) => {
    if (creatorToSave) {
      const result = await dispatch(
        addUserToShortlist({
          shortlistId,
          userId: creatorToSave.id,
        })
      );

      // Refetch shortlists to get updated counts from backend
      if (result.type === addUserToShortlist.fulfilled.type) {
        const refetchResult = await dispatch(getAllShortlists());

        // Update selected shortlist if it matches
        if (selectedShortlist && selectedShortlist.id === shortlistId) {
          if (refetchResult.type === getAllShortlists.fulfilled.type && refetchResult.payload) {
            const updatedShortlist = refetchResult.payload.find((s) => s.id === shortlistId);
            if (updatedShortlist) {
              setSelectedShortlist(updatedShortlist);
            }
          }
        }
      }
    }
    setSaveToShortlistDialogOpen(false);
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

  // Handle inviting creator to apply
  const handleInviteToApply = (creator, campaign) => {
    // Invite logic would go here
  };

  // Transform backend user data to frontend creator format
  const transformUserToCreator = (user) => {
    const creatorProfile = user.creator_profile || {};
    const socialPlatforms = creatorProfile.social_platforms || [];

    return {
      id: user.id,
      name: `${user.first_name || ""} ${user.last_name || ""}`.trim() || "Unknown Creator",
      profileImage: creatorProfile.profile_photo_url || "/default-avatar.png",
      age: user.date_of_birth
        ? new Date().getFullYear() - new Date(user.date_of_birth).getFullYear()
        : "N/A",
      location:
        `${user.city || ""}, ${user.country || ""}`.replace(/^,\s*|,\s*$/g, "") ||
        "Unknown Location",
      rating: 4.5, // Default rating since it's not in the backend yet
      reviewCount: 0, // Default review count
      followers: 10000, // Default followers count
      engagementRate: 3.2, // Default engagement rate
      tagline: creatorProfile.bio || "Creating authentic content that resonates with audiences",
      niches: creatorProfile.categories || [],
      platforms: socialPlatforms.map((sp) => sp.platform).filter(Boolean),
      platformStats: socialPlatforms.reduce((acc, sp) => {
        acc[sp.platform] = {
          followers: Math.floor(Math.random() * 50000) + 1000, // Mock data for now
        };
        return acc;
      }, {}),
      portfolioImages: creatorProfile.mini_profile_pictures || [],
    };
  };

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
    handleShortlistSelect,
    handleCreateShortlist,
    handleCreatorPreview,
    handleSaveToShortlist,
    confirmSaveToShortlist,
    getSortedCreators,
    handleRemoveFromShortlist,
    handleEditShortlist,
    handleDeleteShortlist,
    handleInviteToApply,
    userCampaigns,
    shortlistState,
  };
}

export default useDiscover;
