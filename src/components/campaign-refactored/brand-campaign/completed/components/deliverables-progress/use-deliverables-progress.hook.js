import { avatar } from "@/common/constants/auth.constant";
import { formatCreatorLocation } from "@/common/utils/creator-location.util";
import { isCreatorMode } from "@/common/utils/users.util";
import useMessageThread from "@/components/campaign-refactored/shared/message-thread-modal/use-message-thread.hook";
import {
  createCampaignNote,
  deleteCampaignNote,
  getCampaignNotesByCreatorProfile,
  updateCampaignNote,
} from "@/provider/features/campaign-notes/campaign-notes.slice";
import {
  getCampaignReviewsByCreatorProfile,
  getReviewStatus,
} from "@/provider/features/campaign-reviews/campaign-reviews.slice";
import { getContractsByCampaign } from "@/provider/features/contracts/contracts.slice";
import usersService from "@/provider/features/users/users.service";
import {
  requiresCollaborationPayment,
  resolveBrandMarkedCompleteAt,
} from "@/common/utils/campaign.utils";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const useDeliverablesProgress = (
  selectedCampaign = null,
  selectedCreator = null,
  isIndividualCreator = false,
  onClearCreator = null,
  filters = { status: "COMPLETED", sort: "newest" },
  onPipelineUpdated = null
) => {
  const creatorMode = isCreatorMode();
  const dispatch = useDispatch();

  const {
    createCampaignNote: createNoteState,
    getCampaignNotesByCreatorProfile: getNotesByCreatorProfileState,
    updateCampaignNote: updateNoteState,
    deleteCampaignNote: deleteNoteState,
  } = useSelector((state) => state.campaignNotes);

  const {
    getContractsByCampaign: getContractsState,
    getIndividualCollaborationContracts: getIndividualContractsState,
  } = useSelector((state) => state.contracts);

  const {
    getCampaignReviewsByCreatorProfile: getReviewsByCreatorProfileState,
    getReviewStatus: getReviewStatusState,
  } = useSelector((state) => state.campaignReviews || {});

  const [editingNote, setEditingNote] = useState(null);
  const [newNoteText, setNewNoteText] = useState("");
  const [textareaKey, setTextareaKey] = useState(0);

  const [hydratedCreatorUser, setHydratedCreatorUser] = useState(null);

  // Track the last called keys to prevent duplicate calls
  const lastCalledKeysRef = useRef({
    notes: null,
    timeline: null,
    reviews: null,
  });
  const reviewStatusFingerprintRef = useRef("");

  // Extract stable IDs to prevent unnecessary recalculations - extract once at the top
  const selectedCreatorContractCampaignId = selectedCreator?.contract?.campaignId;
  const selectedCampaignId = selectedCampaign?.id;

  const creatorUserId = useMemo(() => {
    if (!selectedCreator) return null;
    if (isIndividualCreator) {
      return selectedCreator?.creatorUserId || selectedCreator?.creator?.id || null;
    }
    return (
      selectedCreator?.creatorUserId || selectedCreator?.creator?.id || null
    );
  }, [
    selectedCreator?.id,
    selectedCreator?.creatorUserId,
    selectedCreator?.creator?.id,
    isIndividualCreator,
  ]);

  const creatorProfileId = useMemo(() => {
    if (!selectedCreator) return null;

    if (isIndividualCreator) {
      return selectedCreator?.contract?.creator?.creator_profile?.id || null;
    }

    return selectedCreator?.creator?.creator_profile?.id || null;
  }, [
    selectedCreator?.id,
    selectedCreator?.contract?.creator?.creator_profile?.id,
    selectedCreator?.creator?.creator_profile?.id,
    isIndividualCreator,
  ]);

  useEffect(() => {
    if (!isIndividualCreator || !creatorUserId) {
      setHydratedCreatorUser(null);
      return;
    }

    usersService.getUserById(creatorUserId).then(
      (response) => {
        const payload = response?.data || null;
        if (payload?.id === creatorUserId) {
          setHydratedCreatorUser(payload);
          return;
        }
        setHydratedCreatorUser(null);
      },
      () => {
        setHydratedCreatorUser(null);
      }
    );
  }, [isIndividualCreator, creatorUserId]);

  const getCreatorData = () => {
    if (!selectedCreator) {
      return {
        id: "unknown",
        name: "Creator",
        image: avatar,
        avatar,
        isOnline: false,
        location: "Location not specified",
        rating: 0,
        bio: "No bio available",
        age: null,
      };
    }

    if (isIndividualCreator) {
      const contractCreator = selectedCreator.contract?.creator || selectedCreator.creator;
      const effectiveCreator = hydratedCreatorUser || contractCreator;
      const contractProfile =
        effectiveCreator?.creator_profile ||
        contractCreator?.creator_profile ||
        selectedCreator.creator?.creator_profile;
      const hydratedProfile = hydratedCreatorUser?.creator_profile;

      return {
        id: creatorProfileId || selectedCreator.creatorUserId || selectedCreator.id,
        name: `${selectedCreator.name || ""}`.trim() || "Creator",
        image: selectedCreator.image || contractProfile?.profile_photo_url || avatar,
        avatar: selectedCreator.image || contractProfile?.profile_photo_url || avatar,
        isOnline: true,
        location: `${selectedCreator.location || ""}`.trim() || "Location not specified",
        rating: Number(
          hydratedProfile?.rating ?? selectedCreator.rating ?? contractProfile?.rating ?? 0
        ),
        reviewCount: Number(
          hydratedProfile?.reviewCount ??
            hydratedProfile?.review_count ??
            selectedCreator.reviewCount ??
            selectedCreator.review_count ??
            contractProfile?.reviewCount ??
            contractProfile?.review_count ??
            0
        ),
        bio: selectedCreator.bio || contractProfile?.bio || "No bio available",
        shippingAddress:
          contractProfile?.shipping_address ||
          hydratedCreatorUser?.creator_profile?.shipping_address ||
          selectedCreator?.creator?.creator_profile?.shipping_address ||
          null,
        age: selectedCreator.age,
      };
    }

    if (selectedCreator.creator) {
      const creator = selectedCreator.creator;
      const profile = creator?.creator_profile;

      return {
        id: selectedCreator.id || creator.id,
        name:
          `${creator.first_name || ""} ${creator.last_name || ""}`.trim() ||
          selectedCreator.name ||
          "Creator",
        image: profile?.profile_photo_url || selectedCreator.image || avatar,
        avatar: profile?.profile_photo_url || selectedCreator.image || avatar,
        isOnline: true,
        location:
          formatCreatorLocation({
            city: creator.city,
            country: creator.country,
            state: creator.state,
            stateShort: creator.state_short,
          }) ||
          selectedCreator.location ||
          "Location not specified",
        rating: parseFloat(profile?.rating) || parseFloat(selectedCreator.rating) || 0,
        reviewCount:
          profile?.reviewCount ||
          profile?.review_count ||
          selectedCreator.reviewCount ||
          selectedCreator.review_count ||
          0,
        bio: profile?.bio || selectedCreator.bio || "No bio available",
        shippingAddress: profile?.shipping_address || null,
        age:
          selectedCreator.age ||
          (creator.date_of_birth
            ? new Date().getFullYear() - new Date(creator.date_of_birth).getFullYear()
            : null),
      };
    }

    return {
      id: selectedCreator.id || "unknown",
      name: `${selectedCreator.name || ""}`.trim() || "Creator",
      image: selectedCreator.image || avatar,
      avatar: selectedCreator.image || avatar,
      isOnline: true,
      location: `${selectedCreator.location || ""}`.trim() || "Location not specified",
      rating: parseFloat(selectedCreator.rating) || 0,
      reviewCount: selectedCreator.reviewCount || 0,
      bio: selectedCreator.bio || "No bio available",
      shippingAddress: selectedCreator?.creator?.creator_profile?.shipping_address || null,
      age: selectedCreator.age,
    };
  };

  const creator = useMemo(
    () => getCreatorData(),
    [
      selectedCreator?.id,
      selectedCreator?.name,
      selectedCreator?.image,
      selectedCreator?.location,
      selectedCreator?.rating,
      selectedCreator?.reviewCount,
      selectedCreator?.bio,
      selectedCreator?.age,
      selectedCreator?.creatorUserId,
      selectedCreator?.creator?.id,
      selectedCreator?.creator?.first_name,
      selectedCreator?.creator?.last_name,
      selectedCreator?.creator?.city,
      selectedCreator?.creator?.country,
      selectedCreator?.creator?.date_of_birth,
      selectedCreator?.creator?.creator_profile?.id,
      selectedCreator?.creator?.creator_profile?.profile_photo_url,
      selectedCreator?.creator?.creator_profile?.rating,
      selectedCreator?.creator?.creator_profile?.review_count,
      selectedCreator?.creator?.creator_profile?.bio,
      selectedCreator?.contract?.id,
      selectedCreator?.contract?.creator?.id,
      selectedCreator?.contract?.creator?.creator_profile?.id,
      selectedCreator?.contract?.creator?.creator_profile?.profile_photo_url,
      selectedCreator?.contract?.creator?.creator_profile?.rating,
      selectedCreator?.contract?.creator?.creator_profile?.review_count,
      selectedCreator?.contract?.creator?.creator_profile?.bio,
      selectedCreator?.contract?.creator?.creator_profile?.shipping_address,
      selectedCreator?.creator?.creator_profile?.shipping_address,
      hydratedCreatorUser?.id,
      hydratedCreatorUser?.creator_profile?.shipping_address,
      creatorProfileId,
      isIndividualCreator,
    ]
  );

  const messageCampaignId = useMemo(() => {
    if (isIndividualCreator) {
      return selectedCreatorContractCampaignId || null;
    }
    return selectedCampaignId || null;
  }, [isIndividualCreator, selectedCreatorContractCampaignId, selectedCampaignId]);

  const applicationPitch = useMemo(() => {
    const raw =
      selectedCreator?.pitch ||
      selectedCreator?.custom_message ||
      selectedCreator?.application?.pitch ||
      selectedCreator?.application?.custom_message ||
      selectedCreator?.contract?.application?.pitch ||
      selectedCreator?.contract?.application?.custom_message ||
      "";
    const trimmed = typeof raw === "string" ? raw.trim() : "";
    return trimmed.length > 0 ? trimmed : null;
  }, [
    selectedCreator?.pitch,
    selectedCreator?.custom_message,
    selectedCreator?.application?.pitch,
    selectedCreator?.application?.custom_message,
    selectedCreator?.contract?.application?.pitch,
    selectedCreator?.contract?.application?.custom_message,
  ]);

  const messageThreadHook = useMessageThread(
    creatorUserId,
    messageCampaignId,
    null,
    applicationPitch
  );

  const handleMessageClick = () => {
    if (!messageCampaignId) {
      return;
    }

    messageThreadHook.openMessageModal(messageCampaignId);
  };

  const privateNotes = getNotesByCreatorProfileState.data || [];

  // Use stable references to prevent unnecessary recalculations
  const individualContractsData = getIndividualContractsState.data;
  const multiContractsData = getContractsState.data;
  const individualContractsLength = Array.isArray(individualContractsData)
    ? individualContractsData.length
    : 0;
  const multiContractsLength = Array.isArray(multiContractsData) ? multiContractsData.length : 0;

  const contracts = useMemo(() => {
    if (isIndividualCreator) {
      return Array.isArray(individualContractsData) ? individualContractsData : [];
    }
    return Array.isArray(multiContractsData) ? multiContractsData : [];
  }, [isIndividualCreator, individualContractsLength, multiContractsLength]);

  const selectedContract = useMemo(() => {
    if (!selectedCreator || !contracts || contracts.length === 0) return null;

    if (isIndividualCreator) {
      return (
        contracts.find((contract) => {
          const contractCreatorId =
            contract.creator?.id || contract.creatorId || contract.creator_id;
          const contractId = contract.id;
          return (
            contractCreatorId === creatorUserId ||
            contractId === selectedCreator.contractId ||
            contractId === selectedCreator.id
          );
        }) || contracts[0]
      );
    }

    const possibleCreatorIds = [creatorProfileId, creatorUserId].filter(Boolean);
    return (
      contracts.find((contract) => {
        const contractCreatorId = contract.creator?.id || contract.creatorId || contract.creator_id;
        return possibleCreatorIds.includes(contractCreatorId);
      }) || contracts[0]
    );
  }, [
    contracts,
    selectedCreator?.id,
    selectedCreator?.contractId,
    creatorProfileId,
    creatorUserId,
    isIndividualCreator,
  ]);

  // Individual collaboration contracts list is fetched by the parent (Active: use-active-brand, Completed: brand handleToggleChange). This hook only reads from Redux — do not dispatch here or the right pane mounts/unmounts on loading and causes an infinite loop on Completed tab.

  const effectiveCampaignId = useMemo(() => {
    if (isIndividualCreator) {
      return selectedCreatorContractCampaignId || null;
    }
    return selectedCampaignId || null;
  }, [isIndividualCreator, selectedCreatorContractCampaignId, selectedCampaignId]);

  useEffect(() => {
    if (creatorMode) return;
    if (!selectedCreator) return;
    if (!creatorProfileId) return;
    if (!effectiveCampaignId) return;

    // Create a unique key for this combination - only depends on actual IDs
    const currentKey = `${effectiveCampaignId}-${creatorProfileId}-${isIndividualCreator}`;

    // Prevent duplicate API calls - check if we already called with this exact key
    if (lastCalledKeysRef.current.notes === currentKey) {
      return;
    }

    // Update the ref BEFORE making the call to prevent race conditions
    lastCalledKeysRef.current.notes = currentKey;

    if (isIndividualCreator) {
      dispatch(
        getCampaignNotesByCreatorProfile({ campaignId: effectiveCampaignId, creatorProfileId })
      );
    } else {
      dispatch(getContractsByCampaign(effectiveCampaignId));
      dispatch(
        getCampaignNotesByCreatorProfile({ campaignId: effectiveCampaignId, creatorProfileId })
      );
    }
  }, [
    dispatch,
    effectiveCampaignId,
    creatorProfileId,
    isIndividualCreator,
    creatorMode,
    selectedCreator?.id,
  ]);

  const handleEditNote = (noteId) => {
    const note = privateNotes.find((n) => n.id === noteId);
    if (note) {
      setEditingNote(noteId);
      setNewNoteText(note.text || note.note || "");
    }
  };

  const handleSaveEditNote = async (noteId) => {
    if (!creatorProfileId || !effectiveCampaignId) return;

    await dispatch(
      updateCampaignNote({
        noteId,
        noteData: { text: newNoteText },
      })
    ).unwrap();

    setEditingNote(null);
    setNewNoteText("");
    setTextareaKey((prev) => prev + 1);

    if (!creatorMode) {
      dispatch(
        getCampaignNotesByCreatorProfile({ campaignId: effectiveCampaignId, creatorProfileId })
      );
    }
  };

  const handleCancelEditNote = () => {
    setEditingNote(null);
    setNewNoteText("");
    setTextareaKey((prev) => prev + 1);
  };

  const handleDeleteNote = async (noteId) => {
    if (!creatorProfileId || !effectiveCampaignId) return;

    await dispatch(deleteCampaignNote(noteId)).unwrap();

    if (!creatorMode) {
      dispatch(
        getCampaignNotesByCreatorProfile({ campaignId: effectiveCampaignId, creatorProfileId })
      );
    }
  };

  const handleSaveNewNote = async () => {
    if (!newNoteText.trim() || !creatorProfileId || !effectiveCampaignId) return;

    await dispatch(
      createCampaignNote({
        campaignId: effectiveCampaignId,
        creatorProfileId: creatorProfileId,
        noteData: { text: newNoteText.trim() },
      })
    ).unwrap();

    setNewNoteText("");
    setTextareaKey((prev) => prev + 1);

    if (!creatorMode) {
      dispatch(
        getCampaignNotesByCreatorProfile({ campaignId: effectiveCampaignId, creatorProfileId })
      );
    }
  };

  const handleCancelNewNote = () => {
    setNewNoteText("");
    setTextareaKey((prev) => prev + 1);
  };

  useEffect(() => {
    if (!effectiveCampaignId || !creatorProfileId || creatorMode) return;

    // Create a unique key - only depends on actual IDs
    const currentKey = `${effectiveCampaignId}-${creatorProfileId}`;

    // Prevent duplicate API calls
    if (lastCalledKeysRef.current.reviews === currentKey) {
      return;
    }

    // Update the ref BEFORE making the call
    lastCalledKeysRef.current.reviews = currentKey;

    dispatch(getReviewStatus({ campaignId: effectiveCampaignId, creatorProfileId }));
    dispatch(
      getCampaignReviewsByCreatorProfile({
        campaignId: effectiveCampaignId,
        creatorProfileId: creatorProfileId,
      })
    );
  }, [dispatch, effectiveCampaignId, creatorProfileId, creatorMode]);

  const reviewStatus = getReviewStatusState.data || null;

  useEffect(() => {
    reviewStatusFingerprintRef.current = "";
  }, [effectiveCampaignId, creatorProfileId]);

  useEffect(() => {
    if (!reviewStatus) return;

    const fingerprint = JSON.stringify(reviewStatus);
    if (
      reviewStatusFingerprintRef.current &&
      reviewStatusFingerprintRef.current !== fingerprint
    ) {
      onPipelineUpdated?.();
    }
    reviewStatusFingerprintRef.current = fingerprint;
  }, [reviewStatus, onPipelineUpdated]);

  const handleViewCreatorPortfolio = useCallback(() => {
    if (creatorUserId) {
      window.open(`/creator-profile/${creatorUserId}`, "_blank", "noopener,noreferrer");
    }
  }, [creatorUserId]);

  const brandMarkedCompleteAt = useMemo(
    () =>
      resolveBrandMarkedCompleteAt({
        selectedCreator,
        selectedCampaign,
        selectedContract,
        isIndividualCreator,
      }),
    [selectedCreator, selectedCampaign, selectedContract, isIndividualCreator]
  );

  const requiresCollaborationPaymentFlag = useMemo(
    () =>
      requiresCollaborationPayment({
        contract: selectedContract,
        campaign: selectedCampaign,
        application: selectedCreator,
        compensation: selectedCreator?.compensation,
        type: selectedCreator?.type,
      }),
    [selectedContract, selectedCampaign, selectedCreator]
  );

  return {
    messageThreadHook,
    handleMessageClick,
    creator,
    creatorUserId,
    privateNotes,
    editingNote,
    newNoteText,
    setNewNoteText,
    textareaKey,
    handleEditNote,
    handleSaveEditNote,
    handleCancelEditNote,
    handleDeleteNote,
    handleSaveNewNote,
    handleCancelNewNote,
    isNotesLoading: getNotesByCreatorProfileState.isLoading,
    isCreateNoteLoading: createNoteState.isLoading,
    isUpdateNoteLoading: updateNoteState.isLoading,
    isDeleteNoteLoading: deleteNoteState.isLoading,
    isContractsLoading: isIndividualCreator
      ? getIndividualContractsState.isLoading
      : getContractsState.isLoading,
    selectedContract,
    contracts,
    campaignReviews: getReviewsByCreatorProfileState.data || [],
    reviewStatus,
    isReviewsLoading: getReviewsByCreatorProfileState.isLoading || getReviewStatusState.isLoading,
    handleViewCreatorPortfolio,
    brandMarkedCompleteAt,
    requiresCollaborationPayment: requiresCollaborationPaymentFlag,
  };
};

export default useDeliverablesProgress;
