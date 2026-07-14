import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createOrGetConversation,
  getConversationMessages,
  sendMessage,
  markConversationMessagesAsSeen,
} from "@/provider/features/chat/chat.slice";
import chatSocketService from "@/provider/features/chat/chat-socket.service";
import chatService from "@/provider/features/chat/chat.service";
import { getUser } from "@/common/utils/users.util";
import { getCreatorFirstName } from "@/common/utils/creator-name.util";
import ROLES from "@/common/constants/role.constant";

const useMessageThread = (
  creatorId,
  campaignId,
  onMessageSent,
  applicationPitch = null,
  threadParticipant = null
) => {
  const dispatch = useDispatch();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [conversationId, setConversationId] = useState(null);
  const [error, setError] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [attachmentPreview, setAttachmentPreview] = useState(null);

  // Refs
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const emojiButtonRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const sendingRef = useRef(false);
  const fileInputRef = useRef(null);
  const hasFetchedMessagesRef = useRef(false);
  const pollingIntervalRef = useRef(null);
  const openThreadGenerationRef = useRef(0);

  const { messages: allMessages, onlineUsers, typingUsers } = useSelector((state) => state.chat);
  const {
    createOrGetConversation: conversationState,
    getConversationMessages: messagesState,
    sendMessage: sendMessageState,
  } = useSelector((state) => state.chat);

  const initialMessagePayload = useMemo(() => {
    if (!applicationPitch) return null;
    if (typeof applicationPitch === "string") {
      return { content: applicationPitch, senderRole: ROLES.CREATOR, campaignId: null };
    }
    if (typeof applicationPitch === "object" && applicationPitch?.content) {
      return {
        content: String(applicationPitch.content),
        senderRole: (applicationPitch.senderRole || ROLES.CREATOR).toUpperCase(),
        campaignId: applicationPitch.campaignId ?? null,
        creatorId: applicationPitch.creatorId ?? null,
        brandId: applicationPitch.brandId ?? null,
      };
    }
    return null;
  }, [applicationPitch]);

  const boundConversationId = conversationState?.data?.id ?? null;
  const boundCampaignId =
    conversationState?.data?.campaign_id ?? conversationState?.data?.campaign?.id ?? null;
  const boundBrandId = conversationState?.data?.brand?.id ?? null;
  const boundCreatorUserId = conversationState?.data?.creator?.id ?? null;

  const viewer = getUser();
  const isBoundConversationForThread = useMemo(() => {
    if (!conversationId || conversationId !== boundConversationId) {
      return false;
    }
    if (campaignId && boundCampaignId && String(boundCampaignId) !== String(campaignId)) {
      return false;
    }
    if (viewer?.role === ROLES.CREATOR) {
      if (creatorId && boundBrandId && String(boundBrandId) !== String(creatorId)) {
        return false;
      }
    } else if (viewer?.role === ROLES.BRAND) {
      if (creatorId && boundCreatorUserId && String(boundCreatorUserId) !== String(creatorId)) {
        return false;
      }
    }
    return true;
  }, [
    conversationId,
    boundConversationId,
    campaignId,
    boundCampaignId,
    creatorId,
    boundBrandId,
    boundCreatorUserId,
    viewer?.role,
    viewer?.id,
  ]);

  const actualMessages = useMemo(() => {
    if (!conversationId || !isBoundConversationForThread) {
      return [];
    }
    return [...(allMessages[conversationId] || [])].sort((a, b) => {
      const dateA = new Date(a.created_at || a.createdAt || 0);
      const dateB = new Date(b.created_at || b.createdAt || 0);
      return dateA - dateB;
    });
  }, [conversationId, isBoundConversationForThread, allMessages]);

  const pitchMatchesThread =
    initialMessagePayload?.content &&
    (!initialMessagePayload.campaignId ||
      !campaignId ||
      String(initialMessagePayload.campaignId) === String(campaignId)) &&
    (!initialMessagePayload.creatorId ||
      !creatorId ||
      String(initialMessagePayload.creatorId) === String(creatorId)) &&
    (!initialMessagePayload.brandId ||
      !creatorId ||
      String(initialMessagePayload.brandId) === String(creatorId)) &&
    conversationId === boundConversationId &&
    isBoundConversationForThread;

  const messages = useMemo(() => {
    if (!isBoundConversationForThread) {
      return [];
    }
    if (!initialMessagePayload?.content || !conversationId || !pitchMatchesThread) {
      return actualMessages;
    }

    if (actualMessages.length > 0) {
      const hasPitchAsMessage = actualMessages.some((msg) => {
        const contentMatches = msg.content?.trim() === initialMessagePayload.content.trim();
        const isCreatorMessage = msg.sender?.role === ROLES.CREATOR;
        const isBrandMessage = msg.sender?.role === ROLES.BRAND;
        return contentMatches && (isCreatorMessage || isBrandMessage);
      });

      if (hasPitchAsMessage) {
        return actualMessages;
      }
    }

    const currentUser = getUser();
    const creatorUserId =
      currentUser?.role === ROLES.CREATOR
        ? currentUser?.id
        : conversationState?.data?.creator?.id || creatorId;
    const brandUserId =
      currentUser?.role === ROLES.BRAND ? currentUser?.id : conversationState?.data?.brand?.id;
    const initialSenderIsBrand = initialMessagePayload.senderRole === ROLES.BRAND;

    const pitchMessage = {
      id: `pitch-${conversationId}`,
      content: initialMessagePayload.content,
      sender: {
        id: initialSenderIsBrand ? brandUserId : creatorUserId,
        role: initialSenderIsBrand ? ROLES.BRAND : ROLES.CREATOR,
      },
      created_at: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      message_type: "TEXT",
      isPitch: true,
    };
    return [pitchMessage, ...actualMessages];
  }, [
    actualMessages,
    initialMessagePayload,
    conversationId,
    creatorId,
    conversationState?.data?.creator?.id,
    conversationState?.data?.brand?.id,
    pitchMatchesThread,
    isBoundConversationForThread,
    boundConversationId,
    boundCampaignId,
  ]);

  const currentUser = getUser();

  const creatorFirstName = useMemo(() => {
    return (
      getCreatorFirstName(threadParticipant) ||
      getCreatorFirstName(conversationState?.data?.creator) ||
      null
    );
  }, [threadParticipant, conversationState?.data?.creator]);

  const showTemplatesButton = currentUser?.role === ROLES.BRAND;

  const otherUserId =
    conversationState?.data?.brand?.id === currentUser?.id
      ? conversationState?.data?.creator?.id
      : conversationState?.data?.brand?.id || creatorId;

  const receiverId =
    currentUser?.role === ROLES.BRAND
      ? conversationState?.data?.creator?.id || creatorId
      : conversationState?.data?.brand?.id || otherUserId;

  const isOtherUserOnline = otherUserId ? onlineUsers.includes(otherUserId) : false;
  const isOtherUserTyping =
    conversationId && otherUserId ? typingUsers[conversationId]?.includes(otherUserId) : false;

  const openMessageModal = useCallback(
    async (overrideCampaignId = null) => {
      const currentUser = getUser();
      if (!creatorId || !currentUser?.id) {
        setError("Unable to start conversation");
        return;
      }

      const effectiveCampaignId = overrideCampaignId || campaignId;
      const openGeneration = ++openThreadGenerationRef.current;

      setConversationId(null);
      hasFetchedMessagesRef.current = false;
      setIsModalOpen(true);
      setError(null);

      if (currentUser.id === creatorId) {
        return;
      }
      if (!effectiveCampaignId) {
        setError("Campaign ID is required to start a conversation");
        return;
      }

      const conversationData = {
        brand_id: currentUser.role === ROLES.BRAND ? currentUser.id : creatorId,
        creator_id: currentUser.role === ROLES.CREATOR ? currentUser.id : creatorId,
        campaign_id: effectiveCampaignId,
      };

      try {
        const result = await dispatch(createOrGetConversation(conversationData)).unwrap();
        const convId = result.data.id;
        const resolvedCampaignId =
          result.data.campaign_id ?? result.data.campaign?.id ?? effectiveCampaignId;

        if (
          String(resolvedCampaignId) !== String(effectiveCampaignId) ||
          (currentUser.role === ROLES.BRAND &&
            result.data.creator?.id &&
            String(result.data.creator.id) !== String(creatorId)) ||
          (currentUser.role === ROLES.CREATOR &&
            result.data.brand?.id &&
            String(result.data.brand.id) !== String(creatorId))
        ) {
          setError("Unable to load the conversation for this campaign");
          return;
        }

        if (openGeneration !== openThreadGenerationRef.current) {
          return;
        }

        const conversationChanged = conversationId !== convId;
        if (conversationChanged) {
          setConversationId(convId);
          hasFetchedMessagesRef.current = false;
        }

        if (!chatSocketService.isSocketConnected()) {
          chatSocketService.connect(dispatch);
        }

        chatSocketService.joinConversation(convId);

        if (!hasFetchedMessagesRef.current || conversationChanged) {
          await dispatch(
            getConversationMessages({
              conversationId: convId,
              limit: 50,
              offset: 0,
            })
          ).unwrap();

          hasFetchedMessagesRef.current = true;
          await dispatch(markConversationMessagesAsSeen(convId)).unwrap();
          scrollToBottom();
        }
      } catch (err) {
        const errorMessage =
          err?.message || err?.response?.data?.message || "Unable to start conversation";
        setError(errorMessage);
      }
    },
    [creatorId, campaignId, dispatch]
  );

  const closeMessageModal = useCallback(() => {
    openThreadGenerationRef.current += 1;
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }

    if (conversationId) {
      chatSocketService.leaveConversation(conversationId);
    }

    setIsModalOpen(false);
    setConversationId(null);
    setNewMessage("");
    setError(null);
    setShowEmojiPicker(false);
    setShowTemplatesModal(false);
    hasFetchedMessagesRef.current = false;

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  }, [conversationId]);

  const sendMessageHandler = useCallback(async () => {
    if (
      (!newMessage.trim() && !attachmentPreview) ||
      !conversationId ||
      sendMessageState.isLoading ||
      sendingRef.current
    ) {
      return;
    }

    sendingRef.current = true;

    const currentUser = getUser();
    const currentReceiverId =
      currentUser?.role === ROLES.BRAND
        ? conversationState?.data?.creator?.id || creatorId
        : conversationState?.data?.brand?.id || otherUserId;

    const messageData = {
      conversation_id: conversationId,
      receiver_id: currentReceiverId,
      content: newMessage.trim() || (attachmentPreview ? attachmentPreview.filename : ""),
      message_type: attachmentPreview
        ? attachmentPreview.mimetype.startsWith("image/")
          ? "IMAGE"
          : "FILE"
        : "TEXT",
      attachment_url: attachmentPreview?.url || null,
    };

    try {
      await dispatch(sendMessage(messageData)).unwrap();
      setNewMessage("");
      setAttachmentPreview(null);
      chatSocketService.stopTyping(conversationId, currentUser?.id, currentReceiverId);
      scrollToBottom();

      if (onMessageSent) {
        onMessageSent();
      }
    } catch (err) {
      setError("Failed to send message. Please try again.");
    } finally {
      setTimeout(() => {
        sendingRef.current = false;
      }, 500);
    }
  }, [
    newMessage,
    attachmentPreview,
    conversationId,
    creatorId,
    dispatch,
    sendMessageState.isLoading,
    onMessageSent,
    conversationState?.data,
    otherUserId,
  ]);

  const handleMessageChange = useCallback(
    (value) => {
      if (typeof value === "function") {
        setNewMessage(value);
      } else {
        setNewMessage(value);
      }

      if (!conversationId) return;

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      const currentUser = getUser();
      const currentReceiverId =
        currentUser?.role === ROLES.BRAND
          ? conversationState?.data?.creator?.id || creatorId
          : conversationState?.data?.brand?.id || otherUserId;

      const stringValue = typeof value === "function" ? "" : String(value || "");
      if (stringValue.trim()) {
        chatSocketService.startTyping(conversationId, currentUser?.id, currentReceiverId);
        typingTimeoutRef.current = setTimeout(() => {
          chatSocketService.stopTyping(conversationId, currentUser?.id, currentReceiverId);
        }, 2000);
      } else {
        chatSocketService.stopTyping(conversationId, currentUser?.id, currentReceiverId);
      }
    },
    [conversationId, creatorId, conversationState?.data, otherUserId]
  );

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, []);

  useEffect(() => {
    // Prevent stale chat flash when switching between different creator/campaign threads.
    setConversationId(null);
    setError(null);
    hasFetchedMessagesRef.current = false;
  }, [creatorId, campaignId]);

  const formatMessageTime = useCallback((timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } else if (diffInHours < 168) {
      return date.toLocaleDateString("en-US", {
        weekday: "short",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const handleEmojiClick = useCallback((emojiData) => {
    const emoji = emojiData.emoji || emojiData.native || emojiData;
    setNewMessage((prev) => prev + emoji);
    setShowEmojiPicker(false);
  }, []);

  const toggleEmojiPicker = useCallback(() => {
    setShowEmojiPicker((prev) => !prev);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        !showEmojiPicker ||
        !emojiPickerRef.current ||
        !emojiButtonRef.current ||
        emojiPickerRef.current.contains(event.target) ||
        emojiButtonRef.current.contains(event.target)
      ) {
        return;
      }
      setShowEmojiPicker(false);
    };

    if (showEmojiPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEmojiPicker]);

  const handleKeyPress = useCallback(
    (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessageHandler();
      }
    },
    [sendMessageHandler]
  );

  const handleFileSelect = useCallback(async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      setError("File size must be less than 50MB");
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError(
        "File type not supported. Please upload images (JPEG, PNG, GIF, WebP) or documents (PDF, DOC, DOCX)."
      );
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const response = await chatService.uploadAttachment(file);
      setAttachmentPreview({
        url: response.data.url,
        filename: file.originalname || file.name,
        mimetype: file.type,
        size: file.size,
      });

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      setError("Failed to upload file. Please try again.");
    } finally {
      setIsUploading(false);
    }
  }, []);

  const removeAttachment = useCallback(() => {
    setAttachmentPreview(null);
  }, []);

  const openFilePicker = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const openTemplatesModal = useCallback(() => {
    setShowTemplatesModal(true);
  }, []);

  const closeTemplatesModal = useCallback(() => {
    setShowTemplatesModal(false);
  }, []);

  const handleTemplateSelect = useCallback(
    (templateText) => {
      const resolvedName =
        creatorFirstName ||
        getCreatorFirstName(threadParticipant) ||
        getCreatorFirstName(conversationState?.data?.creator) ||
        "there";
      const finalMessage = templateText.replace(/\{\{creator_name\}\}/gi, resolvedName);
      handleMessageChange(finalMessage);
      setShowTemplatesModal(false);
    },
    [
      creatorFirstName,
      threadParticipant,
      conversationState?.data?.creator,
      handleMessageChange,
    ]
  );

  // Single useEffect to handle socket connection and message fetching
  useEffect(() => {
    if (!conversationId || !isModalOpen) {
      // Clear polling when modal closes
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
      return;
    }

    // Ensure socket is connected
    if (!chatSocketService.isSocketConnected()) {
      chatSocketService.connect(dispatch);
    }

    // Join conversation room for real-time updates
    chatSocketService.joinConversation(conversationId);

    if (!hasFetchedMessagesRef.current) {
      dispatch(
        getConversationMessages({
          conversationId,
          limit: 50,
          offset: 0,
        })
      )
        .then(() => {
          hasFetchedMessagesRef.current = true;
          setTimeout(() => scrollToBottom(), 100);
        })
        .catch(() => {
          hasFetchedMessagesRef.current = false;
        });
    }

    // Fallback polling only if WebSocket might have issues (30 seconds, much less aggressive)
    // This is just a safety net, WebSocket should handle real-time updates
    if (!pollingIntervalRef.current) {
      pollingIntervalRef.current = setInterval(() => {
        // Only poll if we have messages (meaning conversation exists)
        // This prevents unnecessary API calls for empty conversations
        const existingMessages = allMessages[conversationId] || [];
        if (existingMessages.length > 0 || hasFetchedMessagesRef.current) {
          dispatch(
            getConversationMessages({
              conversationId,
              limit: 50,
              offset: 0,
            })
          );
        }
      }, 30000); // 30 seconds - much less aggressive
    }

    return () => {
      chatSocketService.leaveConversation(conversationId);
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId, isModalOpen, dispatch]);

  // Auto-scroll when new messages arrive
  useEffect(() => {
    if (conversationId && isModalOpen) {
      const conversationMessages = allMessages[conversationId] || [];
      if (conversationMessages.length > 0) {
        scrollToBottom();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allMessages, conversationId, isModalOpen]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  return {
    isModalOpen,
    openMessageModal,
    closeMessageModal,
    messages,
    newMessage,
    setNewMessage: handleMessageChange,
    isLoading:
      messagesState.isLoading ||
      (isModalOpen && !conversationId && conversationState.isLoading),
    isSending: sendMessageState.isLoading,
    isCreatorOnline: isOtherUserOnline,
    isCreatorTyping: isOtherUserTyping,
    error,
    clearError,
    sendMessage: sendMessageHandler,
    showEmojiPicker,
    toggleEmojiPicker,
    handleEmojiClick,
    isUploading,
    attachmentPreview,
    handleFileSelect,
    removeAttachment,
    openFilePicker,
    fileInputRef,
    messagesEndRef,
    messagesContainerRef,
    formatMessageTime,
    scrollToBottom,
    conversationId,
    user: currentUser,
    actualShowEmojiPicker: showEmojiPicker,
    emojiPickerRef,
    emojiButtonRef,
    handleKeyPress,
    handleToggleEmojiClick: toggleEmojiPicker,
    showTemplatesModal,
    openTemplatesModal,
    closeTemplatesModal,
    handleTemplateSelect,
    creatorFirstName,
    showTemplatesButton,
  };
};

export function pickMessageThreadModalProps(hook) {
  return {
    user: hook.user,
    actualShowEmojiPicker: hook.actualShowEmojiPicker,
    emojiPickerRef: hook.emojiPickerRef,
    emojiButtonRef: hook.emojiButtonRef,
    handleKeyPress: hook.handleKeyPress,
    handleToggleEmojiClick: hook.handleToggleEmojiClick,
    formatMessageTime: hook.formatMessageTime,
    handleEmojiClick: hook.handleEmojiClick,
    isUploading: hook.isUploading,
    attachmentPreview: hook.attachmentPreview,
    handleFileSelect: hook.handleFileSelect,
    removeAttachment: hook.removeAttachment,
    openFilePicker: hook.openFilePicker,
    fileInputRef: hook.fileInputRef,
    showTemplatesModal: hook.showTemplatesModal,
    openTemplatesModal: hook.openTemplatesModal,
    closeTemplatesModal: hook.closeTemplatesModal,
    handleTemplateSelect: hook.handleTemplateSelect,
    creatorFirstName: hook.creatorFirstName,
    showTemplatesButton: hook.showTemplatesButton,
  };
}

export default useMessageThread;
