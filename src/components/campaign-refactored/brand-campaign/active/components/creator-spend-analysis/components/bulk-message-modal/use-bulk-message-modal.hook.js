import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { useDispatch } from "react-redux";
import { enqueueSnackbar } from "notistack";
import { getUser } from "@/common/utils/users.util";
import { createOrGetConversation, sendMessage } from "@/provider/features/chat/chat.slice";

const resolveCreatorUserId = (creator) =>
  creator?.creatorUserId || creator?.creator?.id || null;

export { resolveCreatorUserId };

const MAX_MESSAGE_LENGTH = 2000;

const useBulkMessageModal = (creators, selectedCampaign, isOpen) => {
  const dispatch = useDispatch();
  const [selectedCreatorIds, setSelectedCreatorIds] = useState(new Set());
  const [messageText, setMessageText] = useState("");
  const [selectionError, setSelectionError] = useState("");
  const [messageError, setMessageError] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sendResults, setSendResults] = useState({ success: [], failed: [] });
  const [showResults, setShowResults] = useState(false);
  const [resultSummary, setResultSummary] = useState("");

  const lastInitializedIdsKeyRef = useRef("");
  const wasOpenRef = useRef(false);
  const sendCompletedRef = useRef(false);

  const activeCreators = useMemo(
    () => creators?.filter((creator) => creator.status === "HIRED") ?? [],
    [creators]
  );

  const activeCreatorIdsKey = useMemo(
    () =>
      activeCreators
        .map((creator) => resolveCreatorUserId(creator))
        .filter(Boolean)
        .sort()
        .join(","),
    [activeCreators]
  );

  const buildAllSelectedIds = useCallback(() => {
    return new Set(
      activeCreators.map((creator) => resolveCreatorUserId(creator)).filter(Boolean)
    );
  }, [activeCreators]);

  useEffect(() => {
    if (!isOpen) {
      wasOpenRef.current = false;
      return;
    }

    const isOpening = !wasOpenRef.current;

    if (isOpening) {
      lastInitializedIdsKeyRef.current = activeCreatorIdsKey;
      wasOpenRef.current = true;
      sendCompletedRef.current = false;
      setSelectedCreatorIds(buildAllSelectedIds());
      setMessageText("");
      setSelectionError("");
      setMessageError("");
      setSendResults({ success: [], failed: [] });
      setShowResults(false);
      setResultSummary("");
      return;
    }

    const creatorsChanged = activeCreatorIdsKey !== lastInitializedIdsKeyRef.current;
    if (creatorsChanged && !sendCompletedRef.current) {
      lastInitializedIdsKeyRef.current = activeCreatorIdsKey;
      setSelectedCreatorIds(buildAllSelectedIds());
    }
  }, [isOpen, activeCreatorIdsKey, buildAllSelectedIds]);

  const resetState = useCallback(() => {
    sendCompletedRef.current = false;
    setMessageText("");
    setSelectionError("");
    setMessageError("");
    setSendResults({ success: [], failed: [] });
    setShowResults(false);
    setResultSummary("");
    setSelectedCreatorIds(buildAllSelectedIds());
  }, [buildAllSelectedIds]);

  const handleDismissResults = useCallback(() => {
    setShowResults(false);
    setResultSummary("");
  }, []);

  const updateMessageText = useCallback((value) => {
    setMessageText(value);
    if (value.length > MAX_MESSAGE_LENGTH) {
      setMessageError(`Message must be ${MAX_MESSAGE_LENGTH} characters or fewer.`);
      return;
    }
    setMessageError("");
  }, []);

  const handleCreatorToggle = useCallback((creatorId) => {
    if (isSending) return;
    setSelectionError("");
    setSelectedCreatorIds((prev) => {
      const next = new Set(prev);
      if (next.has(creatorId)) {
        next.delete(creatorId);
      } else {
        next.add(creatorId);
      }
      return next;
    });
  }, [isSending]);

  const handleSelectAll = useCallback(() => {
    if (isSending) return;
    setSelectionError("");
    setSelectedCreatorIds(buildAllSelectedIds());
  }, [buildAllSelectedIds, isSending]);

  const handleDeselectAll = useCallback(() => {
    if (isSending) return;
    setSelectionError("");
    setSelectedCreatorIds(new Set());
  }, [isSending]);

  const handleSelectAllToggle = useCallback(
    (checked) => {
      if (isSending) return;
      if (checked) {
        handleSelectAll();
      } else {
        handleDeselectAll();
      }
    },
    [handleSelectAll, handleDeselectAll, isSending]
  );

  const validateMessage = useCallback(() => {
    let isValid = true;

    if (selectedCreatorIds.size === 0) {
      setSelectionError("Select at least one creator to send a bulk message.");
      isValid = false;
    } else {
      setSelectionError("");
    }

    if (!messageText.trim() || messageText.trim().length < 5) {
      setMessageError("Please enter a message before sending.");
      isValid = false;
    } else if (messageText.length > MAX_MESSAGE_LENGTH) {
      setMessageError(`Message must be ${MAX_MESSAGE_LENGTH} characters or fewer.`);
      isValid = false;
    } else {
      setMessageError("");
    }

    return isValid;
  }, [messageText, selectedCreatorIds]);

  const handleSendMessages = useCallback(async () => {
    if (!validateMessage()) {
      return;
    }

    if (!selectedCampaign?.id) {
      setMessageError("Campaign ID is required");
      return;
    }

    const currentUser = getUser();
    if (!currentUser?.id) {
      setMessageError("User not authenticated");
      return;
    }

    const brandId = currentUser.id;
    const campaignId = selectedCampaign.id;

    setIsSending(true);
    setSelectionError("");
    setMessageError("");
    setSendResults({ success: [], failed: [] });
    setShowResults(false);
    setResultSummary("");

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

    setIsSending(false);

    const successCount = successResults.length;
    const failedCount = failedResults.length;

    if (failedCount === 0) {
      const summary = `Bulk message sent to ${successCount} creator${successCount !== 1 ? "s" : ""}.`;
      sendCompletedRef.current = true;
      setSendResults({ success: successResults, failed: [] });
      setResultSummary(summary);
      setShowResults(true);
      setMessageText("");
      setMessageError("");
      enqueueSnackbar(summary, { variant: "success" });
      return;
    }

    sendCompletedRef.current = true;
    setSendResults({ success: successResults, failed: failedResults });
    setShowResults(true);

    if (successCount === 0) {
      setResultSummary("We could not send this message. Please try again.");
      return;
    }

    setResultSummary(
      `Message sent to ${successCount} creator${successCount !== 1 ? "s" : ""}. Failed for ${failedCount} creator${failedCount !== 1 ? "s" : ""}. Please try again or contact support if this continues.`
    );
  }, [
    validateMessage,
    selectedCampaign,
    selectedCreatorIds,
    messageText,
    activeCreators,
    dispatch,
  ]);

  const selectedCount = selectedCreatorIds.size;
  const totalCount = activeCreators.length;
  const isAllSelected = selectedCount === totalCount && totalCount > 0;
  const isMessageOverLimit = messageText.length > MAX_MESSAGE_LENGTH;

  return {
    selectedCreatorIds,
    messageText,
    setMessageText: updateMessageText,
    selectionError,
    messageError,
    isSending,
    sendResults,
    showResults,
    resultSummary,
    activeCreators,
    selectedCount,
    totalCount,
    isAllSelected,
    isMessageOverLimit,
    maxMessageLength: MAX_MESSAGE_LENGTH,
    handleCreatorToggle,
    handleSelectAll,
    handleDeselectAll,
    handleSelectAllToggle,
    handleSendMessages,
    resetState,
    handleDismissResults,
  };
};

export default useBulkMessageModal;
