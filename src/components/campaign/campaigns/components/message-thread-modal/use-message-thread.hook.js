import { useState, useCallback, useRef, useEffect } from "react";
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

const useMessageThread = (creatorId, campaignId, onMessageSent) => {
  const dispatch = useDispatch();
  const user = getUser();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [conversationId, setConversationId] = useState(null);
  const [error, setError] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [attachmentPreview, setAttachmentPreview] = useState(null);

  // Refs
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const sendingRef = useRef(false);
  const fileInputRef = useRef(null);
  const hasFetchedMessagesRef = useRef(false);
  const pollingIntervalRef = useRef(null);

  const { messages: allMessages, onlineUsers, typingUsers } = useSelector((state) => state.chat);
  const {
    createOrGetConversation: conversationState,
    getConversationMessages: messagesState,
    sendMessage: sendMessageState,
  } = useSelector((state) => state.chat);

  const messages = conversationId
    ? [...(allMessages[conversationId] || [])].sort((a, b) => {
        const dateA = new Date(a.created_at || a.createdAt || 0);
        const dateB = new Date(b.created_at || b.createdAt || 0);
        return dateA - dateB;
      })
    : [];

  // Get the other user ID from conversation or use creatorId
  const otherUserId = conversationState?.data?.brand?.id === user?.id 
    ? conversationState?.data?.creator?.id 
    : conversationState?.data?.brand?.id || creatorId;
  
  // Determine receiver ID based on user role and conversation
  const receiverId = user?.role === "BRAND" 
    ? (conversationState?.data?.creator?.id || creatorId)
    : (conversationState?.data?.brand?.id || otherUserId);
  
  const isOtherUserOnline = otherUserId ? onlineUsers.includes(otherUserId) : false;
  const isOtherUserTyping = conversationId && otherUserId ? typingUsers[conversationId]?.includes(otherUserId) : false;

  const openMessageModal = useCallback(async (overrideCampaignId = null) => {
    if (!creatorId || !user?.id) {
      setError("Unable to start conversation");
      return;
    }

    setIsModalOpen(true);
    setError(null);
    hasFetchedMessagesRef.current = false;

    if (user.id === creatorId) {
      return;
    }

    const effectiveCampaignId = overrideCampaignId || campaignId;
    if (!effectiveCampaignId) {
      setError("Campaign ID is required to start a conversation");
      return;
    }

    const conversationData = {
      brand_id: user.role === "BRAND" ? user.id : creatorId,
      creator_id: user.role === "CREATOR" ? user.id : creatorId,
      campaign_id: effectiveCampaignId,
    };

    const result = await dispatch(createOrGetConversation(conversationData)).unwrap();
    const convId = result.data.id;
    setConversationId(convId);

    // Ensure socket is connected
    if (!chatSocketService.isSocketConnected()) {
      chatSocketService.connect(dispatch);
    }
    
    // Join conversation room for real-time updates
    chatSocketService.joinConversation(convId);

    // Fetch messages ONCE when modal opens
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
  }, [creatorId, campaignId, user, dispatch]);

  const closeMessageModal = useCallback(() => {
    // Clear polling interval
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }

    // Leave conversation room when closing modal
    if (conversationId) {
      chatSocketService.leaveConversation(conversationId);
    }
    
    setIsModalOpen(false);
    setNewMessage("");
    setConversationId(null);
    setError(null);
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

    // Determine receiver ID
    const currentReceiverId = user?.role === "BRAND" 
      ? (conversationState?.data?.creator?.id || creatorId)
      : (conversationState?.data?.brand?.id || otherUserId);

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
      chatSocketService.stopTyping(conversationId, user.id, currentReceiverId);
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
    user,
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

      // Determine receiver ID from conversation data
      const currentReceiverId = user?.role === "BRAND" 
        ? (conversationState?.data?.creator?.id || creatorId)
        : (conversationState?.data?.brand?.id || otherUserId);

      const stringValue = typeof value === "function" ? "" : String(value || "");
      if (stringValue.trim()) {
        chatSocketService.startTyping(conversationId, user.id, currentReceiverId);
        typingTimeoutRef.current = setTimeout(() => {
          chatSocketService.stopTyping(conversationId, user.id, currentReceiverId);
        }, 2000);
      } else {
        chatSocketService.stopTyping(conversationId, user.id, currentReceiverId);
      }
    },
    [conversationId, creatorId, user, conversationState?.data, otherUserId]
  );

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, []);

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

    // Only fetch if we haven't already fetched (prevents duplicate fetches)
    if (!hasFetchedMessagesRef.current) {
      dispatch(
        getConversationMessages({
          conversationId,
          limit: 50,
          offset: 0,
        })
      ).then(() => {
        hasFetchedMessagesRef.current = true;
        setTimeout(() => scrollToBottom(), 100);
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
    isLoading: messagesState.isLoading || conversationState.isLoading,
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
  };
};

export default useMessageThread;
