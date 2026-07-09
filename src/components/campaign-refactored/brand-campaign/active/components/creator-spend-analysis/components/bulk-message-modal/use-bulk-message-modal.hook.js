import { useState, useCallback, useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import { getUser } from "@/common/utils/users.util";
import { createOrGetConversation, sendMessage } from "@/provider/features/chat/chat.slice";

const resolveCreatorUserId = (creator) =>
  creator?.creatorUserId || creator?.creator?.id || null;

export { resolveCreatorUserId };

const useBulkMessageModal = (creators, selectedCampaign) => {
  const dispatch = useDispatch();
  const [selectedCreatorIds, setSelectedCreatorIds] = useState(new Set());
  const [messageText, setMessageText] = useState("");
  const [validationError, setValidationError] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sendResults, setSendResults] = useState({ success: [], failed: [] });
  const [showResults, setShowResults] = useState(false);

  const activeCreators = creators?.filter((creator) => creator.status === "HIRED") || [];

  const activeCreatorIdsKey = useMemo(
    () =>
      activeCreators
        .map((creator) => resolveCreatorUserId(creator))
        .filter(Boolean)
        .join(","),
    [activeCreators]
  );

  useEffect(() => {
    if (activeCreators.length > 0) {
      const allIds = new Set(
        activeCreators.map((creator) => resolveCreatorUserId(creator)).filter(Boolean)
      );
      setSelectedCreatorIds(allIds);
    } else {
      setSelectedCreatorIds(new Set());
    }
  }, [activeCreatorIdsKey, activeCreators]);

  const resetState = useCallback(() => {
    setMessageText("");
    setValidationError("");
    setSendResults({ success: [], failed: [] });
    setShowResults(false);
    const allIds = new Set(
      activeCreators.map((creator) => resolveCreatorUserId(creator)).filter(Boolean)
    );
    setSelectedCreatorIds(allIds);
  }, [activeCreators]);

  const handleCreatorToggle = useCallback((creatorId) => {
    setSelectedCreatorIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(creatorId)) {
        newSet.delete(creatorId);
      } else {
        newSet.add(creatorId);
      }
      return newSet;
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    const allIds = new Set(
      activeCreators.map((creator) => resolveCreatorUserId(creator)).filter(Boolean)
    );
    setSelectedCreatorIds(allIds);
  }, [activeCreators]);

  const handleDeselectAll = useCallback(() => {
    setSelectedCreatorIds(new Set());
  }, []);

  const validateMessage = useCallback(() => {
    if (!messageText.trim()) {
      setValidationError("Message is required");
      return false;
    }
    if (messageText.trim().length < 5) {
      setValidationError("Message must be at least 5 characters long");
      return false;
    }
    if (messageText.trim().length > 2000) {
      setValidationError("Message must be less than 2000 characters");
      return false;
    }
    if (selectedCreatorIds.size === 0) {
      setValidationError("Please select at least one creator");
      return false;
    }
    setValidationError("");
    return true;
  }, [messageText, selectedCreatorIds]);

  const handleSendMessages = useCallback(async () => {
    if (!validateMessage()) {
      return;
    }

    if (!selectedCampaign?.id) {
      setValidationError("Campaign ID is required");
      return;
    }

    const currentUser = getUser();
    if (!currentUser?.id) {
      setValidationError("User not authenticated");
      return;
    }

    const brandId = currentUser.id;
    const campaignId = selectedCampaign.id;

    setIsSending(true);
    setValidationError("");
    setSendResults({ success: [], failed: [] });

    const successResults = [];
    const failedResults = [];

    const selectedCreators = activeCreators.filter((creator) => {
      const creatorId = resolveCreatorUserId(creator);
      return creatorId && selectedCreatorIds.has(creatorId);
    });

    for (const creator of selectedCreators) {
      const creatorId = resolveCreatorUserId(creator);
      if (!creatorId) {
        failedResults.push({
          creatorId: creator.id,
          creatorName: creator.name || "Unknown",
          error: "Invalid creator ID",
        });
        continue;
      }

      try {
        const conversationData = {
          brand_id: brandId,
          creator_id: creatorId,
          campaign_id: campaignId,
        };

        const conversationResult = await dispatch(
          createOrGetConversation(conversationData)
        ).unwrap();

        if (!conversationResult?.success || !conversationResult?.data?.id) {
          throw new Error("Failed to create or get conversation");
        }

        const conversationId = conversationResult.data.id;
        const receiverId = conversationResult.data.creator?.id || creatorId;

        const messageData = {
          conversation_id: conversationId,
          receiver_id: receiverId,
          content: messageText.trim(),
          message_type: "TEXT",
          attachment_url: null,
        };

        await dispatch(sendMessage(messageData)).unwrap();

        successResults.push({
          creatorId,
          creatorName: creator.name || "Unknown",
        });
      } catch (error) {
        const errorMessage =
          error?.message ||
          error?.payload?.message ||
          error?.response?.data?.message ||
          "Failed to send message";
        failedResults.push({
          creatorId,
          creatorName: creator.name || "Unknown",
          error: errorMessage,
        });
      }
    }

    setSendResults({ success: successResults, failed: failedResults });
    setShowResults(true);
    setIsSending(false);

    if (failedResults.length === 0) {
      setTimeout(() => {
        resetState();
      }, 10000);
    }
  }, [
    validateMessage,
    selectedCampaign,
    selectedCreatorIds,
    messageText,
    activeCreators,
    dispatch,
    resetState,
  ]);

  const selectedCount = selectedCreatorIds.size;
  const totalCount = activeCreators.length;

  return {
    selectedCreatorIds,
    messageText,
    setMessageText,
    validationError,
    isSending,
    sendResults,
    showResults,
    setShowResults,
    activeCreators,
    selectedCount,
    totalCount,
    handleCreatorToggle,
    handleSelectAll,
    handleDeselectAll,
    handleSendMessages,
    resetState,
    validateMessage,
  };
};

export default useBulkMessageModal;
