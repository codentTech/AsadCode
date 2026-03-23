import { useState, useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getConversationMessages,
  sendMessage,
  markConversationMessagesAsSeen,
  setActiveConversation,
  getUserConversations,
} from "@/provider/features/chat/chat.slice";
import chatSocketService from "@/provider/features/chat/chat-socket.service";
import chatService from "@/provider/features/chat/chat.service";
import { getUser } from "@/common/utils/users.util";
import DoneOutlinedIcon from "@mui/icons-material/DoneOutlined";
import DoneAllIcon from "@mui/icons-material/DoneAll";

function useInbox(selectedChatId) {
  const dispatch = useDispatch();
  const user = getUser();

  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [attachmentPreview, setAttachmentPreview] = useState(null);
  const [error, setError] = useState(null);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [showClearChatModal, setShowClearChatModal] = useState(false);
  const [showDeleteConversationModal, setShowDeleteConversationModal] = useState(false);
  const typingTimeoutRef = useRef(null);
  const sendingRef = useRef(false); // Prevent duplicate sends
  const lastSentMessageRef = useRef(null); // Track last sent message to prevent duplicates
  const fileInputRef = useRef(null);

  // Get data from Redux
  const chatState = useSelector((state) => state.chat) || {};
  const messages = chatState.messages || {};
  const conversations = chatState.conversations || [];
  const typingUsers = chatState.typingUsers || {};
  const onlineUsers = chatState.onlineUsers || [];
  const messagesState = chatState.getConversationMessages || {};
  const sendMessageState = chatState.sendMessage || {};

  // Get current conversation
  const currentConversation = conversations.find((c) => c.id === selectedChatId);

  // Get messages for current conversation
  const conversationMessages = messages[selectedChatId] || [];

  // Get other user info
  const otherUser = currentConversation
    ? currentConversation.brand.id === user?.id
      ? currentConversation.creator
      : currentConversation.brand
    : null;

  // Check if other user is online
  const isOtherUserOnline = otherUser ? onlineUsers.includes(otherUser.id) : false;

  // Check if other user is typing
  const isOtherUserTyping = selectedChatId
    ? typingUsers[selectedChatId]?.includes(otherUser?.id)
    : false;

  // Fetch messages when conversation changes
  useEffect(() => {
    if (selectedChatId && selectedChatId !== "undefined" && selectedChatId !== null) {
      dispatch(setActiveConversation(selectedChatId));
      dispatch(getConversationMessages({ conversationId: selectedChatId, limit: 50, offset: 0 }));

      // Join conversation room
      chatSocketService.joinConversation(selectedChatId);

      // Mark messages as seen
      console.log("📖 Marking messages as seen for conversation:", selectedChatId);
      dispatch(markConversationMessagesAsSeen(selectedChatId))
        .unwrap()
        .then(() => {
          console.log("✓ Messages marked as seen successfully");
        })
        .catch((err) => {
          console.error("❌ Error marking messages as seen:", err);
        });

      return () => {
        // Leave conversation room on unmount
        chatSocketService.leaveConversation(selectedChatId);
      };
    }
  }, [selectedChatId, dispatch]);

  // Handle send message
  const handleSendMessage = useCallback(async () => {
    const messageContent = message.trim() || (attachmentPreview ? attachmentPreview.filename : "");

    // Prevent duplicate sends
    if (
      !messageContent ||
      !selectedChatId ||
      !otherUser ||
      sendingRef.current ||
      sendMessageState.isLoading
    )
      return;

    // Create a unique message identifier to prevent duplicates
    const messageId = `${selectedChatId}-${messageContent}-${Date.now()}`;

    // Check if this exact message was just sent
    if (lastSentMessageRef.current === messageId) {
      return;
    }

    // Set sending flag immediately
    sendingRef.current = true;
    lastSentMessageRef.current = messageId;

    const messageData = {
      conversation_id: selectedChatId,
      receiver_id: otherUser.id,
      content: messageContent,
      message_type: attachmentPreview
        ? attachmentPreview.mimetype.startsWith("image/")
          ? "IMAGE"
          : "FILE"
        : "TEXT",
      attachment_url: attachmentPreview?.url || null,
    };

    try {
      // Send via Redux (which will also trigger WebSocket)
      await dispatch(sendMessage(messageData));

      // Clear input and attachment
      setMessage("");
      setAttachmentPreview(null);

      // Stop typing indicator
      chatSocketService.stopTyping(selectedChatId, user.id, otherUser.id);
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Failed to send message. Please try again.");
    } finally {
      // Reset sending flag after a longer delay to prevent rapid clicks
      setTimeout(() => {
        sendingRef.current = false;
        lastSentMessageRef.current = null;
      }, 1000);
    }
  }, [
    message,
    attachmentPreview,
    selectedChatId,
    otherUser,
    dispatch,
    user,
    sendMessageState.isLoading,
  ]);

  // Handle key press
  const handleKeyPress = useCallback(
    (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    },
    [handleSendMessage]
  );

  // Handle typing indicator
  const handleTyping = useCallback(
    (value) => {
      setMessage(value);

      if (!selectedChatId || !otherUser) return;

      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Start typing
      if (value.trim() && !isTyping) {
        setIsTyping(true);
        chatSocketService.startTyping(selectedChatId, user.id, otherUser.id);
      }

      // Stop typing after 2 seconds of inactivity
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        chatSocketService.stopTyping(selectedChatId, user.id, otherUser.id);
      }, 2000);
    },
    [selectedChatId, otherUser, user, isTyping]
  );

  // Cleanup typing timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  // Format message time
  const formatMessageTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Get message status icon
  const getMessageStatusIcon = (message) => {
    if (message.sender.id !== user?.id) return null;

    switch (message.status) {
      case "SENT":
        return <DoneOutlinedIcon sx={{ fontSize: 15 }} />;
      case "DELIVERED":
        return <DoneAllIcon sx={{ fontSize: 15 }} />;
      case "SEEN":
        return <DoneAllIcon sx={{ fontSize: 15 }} />; // Could use different color
      default:
        return null;
    }
  };

  /**
   * Handle emoji selection
   */
  const handleEmojiClick = useCallback((emojiData) => {
    const emoji = emojiData.emoji || emojiData.native || emojiData;
    setMessage((prev) => prev + emoji);
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

  /**
   * Toggle message selection
   */
  const toggleMessageSelection = useCallback((messageId) => {
    setSelectedMessages((prev) => {
      if (prev.includes(messageId)) {
        return prev.filter((id) => id !== messageId);
      }
      return [...prev, messageId];
    });
  }, []);

  /**
   * Select all messages
   */
  const selectAllMessages = useCallback(() => {
    if (conversationMessages && conversationMessages.length > 0) {
      setSelectedMessages(conversationMessages.map((msg) => msg.id));
    }
  }, [conversationMessages]);

  /**
   * Clear selection
   */
  const clearSelection = useCallback(() => {
    setSelectedMessages([]);
    setSelectionMode(false);
  }, []);

  /**
   * Delete selected messages
   */
  const deleteSelectedMessages = useCallback(async () => {
    if (selectedMessages.length === 0 || !selectedChatId) return;

    try {
      // Batch delete - single API call
      await chatService.deleteMultipleMessages(selectedMessages);

      // Clear selection
      clearSelection();

      // Reload messages
      await dispatch(
        getConversationMessages({ conversationId: selectedChatId, limit: 50, offset: 0 })
      );

      // Scroll to bottom after reload
      requestAnimationFrame(() => {
        const messagesContainer = document.querySelector(".messages-container");
        if (messagesContainer) {
          messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
      });
    } catch (err) {
      console.error("Error deleting messages:", err);
      setError("Failed to delete messages. Please try again.");
    }
  }, [selectedMessages, selectedChatId, dispatch, clearSelection]);

  /**
   * Delete single message
   */
  const deleteSingleMessage = useCallback(
    async (messageId) => {
      if (!selectedChatId) return;

      try {
        await chatService.deleteMessage(messageId);

        // Reload messages
        await dispatch(
          getConversationMessages({ conversationId: selectedChatId, limit: 50, offset: 0 })
        );

        // Scroll to bottom after reload
        requestAnimationFrame(() => {
          const messagesContainer = document.querySelector(".messages-container");
          if (messagesContainer) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
          }
        });
      } catch (err) {
        console.error("Error deleting message:", err);
        setError("Failed to delete message. Please try again.");
      }
    },
    [selectedChatId, dispatch]
  );

  /**
   * Clear conversation
   */
  const clearConversationHandler = useCallback(async () => {
    if (!selectedChatId) return;

    try {
      await chatService.clearConversation(selectedChatId);

      // Reload messages
      await dispatch(
        getConversationMessages({ conversationId: selectedChatId, limit: 50, offset: 0 })
      );

      // Reload conversations to update last_message in chat list
      await dispatch(getUserConversations({}));

      // Close modal
      setShowClearChatModal(false);
    } catch (err) {
      console.error("Error clearing conversation:", err);
      setError("Failed to clear conversation. Please try again.");
    }
  }, [selectedChatId, dispatch]);

  /**
   * Delete conversation
   */
  const deleteConversationHandler = useCallback(async () => {
    if (!selectedChatId) return;

    try {
      await chatService.deleteConversation(selectedChatId);

      // Close modal
      setShowDeleteConversationModal(false);

      // Reload conversations
      // The parent component should handle navigation
    } catch (err) {
      console.error("Error deleting conversation:", err);
      setError("Failed to delete conversation. Please try again.");
    }
  }, [selectedChatId]);

  return {
    message,
    setMessage: handleTyping,
    handleSendMessage,
    handleKeyPress,
    conversationMessages,
    currentConversation,
    otherUser,
    isOtherUserOnline,
    isOtherUserTyping,
    isLoading: messagesState.isLoading,
    isSending: sendMessageState.isLoading,
    formatMessageTime,
    getMessageStatusIcon,
    user,
    // Emoji
    showEmojiPicker,
    setShowEmojiPicker,
    toggleEmojiPicker,
    handleEmojiClick,
    // Attachments
    isUploading,
    attachmentPreview,
    handleFileSelect,
    removeAttachment,
    openFilePicker,
    fileInputRef,
    // Error
    error,
    // Message selection and deletion
    selectionMode,
    setSelectionMode,
    selectedMessages,
    toggleMessageSelection,
    selectAllMessages,
    clearSelection,
    deleteSelectedMessages,
    deleteSingleMessage,
    clearConversationHandler,
    deleteConversationHandler,
    showOptionsMenu,
    setShowOptionsMenu,
    // Confirmation modals
    showClearChatModal,
    setShowClearChatModal,
    showDeleteConversationModal,
    setShowDeleteConversationModal,
  };
}

export default useInbox;
