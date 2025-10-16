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

/**
 * Custom hook for managing message thread functionality with real chat integration
 * Handles loading messages, pagination, sending new messages, and real-time updates
 */
const useMessageThread = (creatorId) => {
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
  const sendingRef = useRef(false); // Prevent duplicate sends
  const fileInputRef = useRef(null);

  // Get data from Redux
  const { messages: allMessages, onlineUsers, typingUsers } = useSelector((state) => state.chat);
  const {
    createOrGetConversation: conversationState,
    getConversationMessages: messagesState,
    sendMessage: sendMessageState,
  } = useSelector((state) => state.chat);

  // Get messages for current conversation
  const messages = conversationId ? allMessages[conversationId] || [] : [];

  // Check if creator is online
  const isCreatorOnline = creatorId ? onlineUsers.includes(creatorId) : false;

  // Check if creator is typing
  const isCreatorTyping = conversationId ? typingUsers[conversationId]?.includes(creatorId) : false;

  /**
   * Opens the message modal and loads conversation
   */
  const openMessageModal = useCallback(async () => {
    if (!creatorId || !user?.id) {
      setError("Unable to start conversation");
      return;
    }

    setIsModalOpen(true);
    setError(null);

    // Prevent self-conversations
    if (user.id === creatorId) {
      console.warn("Cannot create conversation with yourself");
      return;
    }

    // Create or get conversation
    const conversationData = {
      brand_id: user.id,
      creator_id: creatorId,
    };

    const result = await dispatch(createOrGetConversation(conversationData)).unwrap();
    const convId = result.data.id;
    setConversationId(convId);

    // Load messages
    await dispatch(
      getConversationMessages({
        conversationId: convId,
        limit: 50,
        offset: 0,
      })
    ).unwrap();

    // Mark messages as seen
    await dispatch(markConversationMessagesAsSeen(convId)).unwrap();

    // Scroll to bottom
    scrollToBottom();
  }, [creatorId, user, dispatch]);

  /**
   * Closes the message modal and resets state
   */
  const closeMessageModal = useCallback(() => {
    setIsModalOpen(false);
    setNewMessage("");
    setConversationId(null);
    setError(null);

    // Clear typing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  }, []);

  /**
   * Sends a new message
   */
  const sendMessageHandler = useCallback(async () => {
    // Prevent duplicate sends
    if (
      (!newMessage.trim() && !attachmentPreview) ||
      !conversationId ||
      sendMessageState.isLoading ||
      sendingRef.current
    ) {
      return;
    }

    // Set sending flag
    sendingRef.current = true;

    const messageData = {
      conversation_id: conversationId,
      receiver_id: creatorId,
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

      // Stop typing indicator
      chatSocketService.stopTyping(conversationId, user.id, creatorId);

      // Scroll to bottom
      scrollToBottom();
    } catch (err) {
      setError("Failed to send message. Please try again.");
      console.error("Error sending message:", err);
    } finally {
      // Reset sending flag after a short delay
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
  ]);

  /**
   * Handles message input change with typing indicator
   */
  const handleMessageChange = useCallback(
    (value) => {
      // Handle both string values and function values
      if (typeof value === "function") {
        setNewMessage(value);
      } else {
        setNewMessage(value);
      }

      if (!conversationId || !creatorId) return;

      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Start typing - ensure value is a string before calling trim
      const stringValue = typeof value === "function" ? "" : String(value || "");
      if (stringValue.trim()) {
        chatSocketService.startTyping(conversationId, user.id, creatorId);

        // Stop typing after 2 seconds of inactivity
        typingTimeoutRef.current = setTimeout(() => {
          chatSocketService.stopTyping(conversationId, user.id, creatorId);
        }, 2000);
      } else {
        chatSocketService.stopTyping(conversationId, user.id, creatorId);
      }
    },
    [conversationId, creatorId, user]
  );

  /**
   * Scrolls to the bottom of messages
   */
  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, []);

  /**
   * Formats message timestamp for display
   */
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
      // Less than a week
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

  /**
   * Clears error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Handle emoji selection
   */
  const handleEmojiClick = useCallback((emojiData) => {
    // emoji-picker-react v4+ uses emojiData.emoji
    const emoji = emojiData.emoji || emojiData.native || emojiData;
    setNewMessage((prev) => prev + emoji);
    setShowEmojiPicker(false);
  }, []);

  /**
   * Toggle emoji picker
   */
  const toggleEmojiPicker = useCallback(() => {
    setShowEmojiPicker((prev) => !prev);
  }, []);

  /**
   * Handle file selection
   */
  const handleFileSelect = useCallback(async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file size (50MB - matches backend)
    if (file.size > 50 * 1024 * 1024) {
      setError("File size must be less than 50MB");
      return;
    }

    // Validate file type (matches backend allowed types)
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
      // Upload file
      const response = await chatService.uploadAttachment(file);

      // Set preview - response structure from /upload endpoint
      setAttachmentPreview({
        url: response.data.url,
        filename: file.originalname || file.name,
        mimetype: file.type,
        size: file.size,
      });

      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      setError("Failed to upload file. Please try again.");
      console.error("Error uploading file:", err);
    } finally {
      setIsUploading(false);
    }
  }, []);

  /**
   * Remove attachment preview
   */
  const removeAttachment = useCallback(() => {
    setAttachmentPreview(null);
  }, []);

  /**
   * Open file picker
   */
  const openFilePicker = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  // Join conversation room when conversationId changes and modal is open
  useEffect(() => {
    if (conversationId && isModalOpen) {
      chatSocketService.joinConversation(conversationId);

      return () => {
        chatSocketService.leaveConversation(conversationId);
      };
    }
  }, [conversationId, isModalOpen]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  // Auto-scroll when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages.length, scrollToBottom]);

  return {
    // Modal state
    isModalOpen,
    openMessageModal,
    closeMessageModal,

    // Messages state
    messages,
    newMessage,
    setNewMessage: handleMessageChange,

    // Loading states
    isLoading: messagesState.isLoading || conversationState.isLoading,
    isSending: sendMessageState.isLoading,

    // Online/Typing status
    isCreatorOnline,
    isCreatorTyping,

    // Error handling
    error,
    clearError,

    // Actions
    sendMessage: sendMessageHandler,

    // Emoji
    showEmojiPicker,
    toggleEmojiPicker,
    handleEmojiClick,

    // Attachments
    isUploading,
    attachmentPreview,
    handleFileSelect,
    removeAttachment,
    openFilePicker,
    fileInputRef,

    // Refs
    messagesEndRef,
    messagesContainerRef,

    // Utilities
    formatMessageTime,
    scrollToBottom,

    // Conversation info
    conversationId,
  };
};

export default useMessageThread;
