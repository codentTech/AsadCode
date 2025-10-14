import { useState, useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getConversationMessages,
  sendMessage,
  markConversationMessagesAsSeen,
  setActiveConversation,
} from "@/provider/features/chat/chat.slice";
import chatSocketService from "@/provider/features/chat/chat-socket.service";
import { getUser } from "@/common/utils/users.util";
import DoneOutlinedIcon from "@mui/icons-material/DoneOutlined";
import DoneAllIcon from "@mui/icons-material/DoneAll";

function useInbox(selectedChatId) {
  const dispatch = useDispatch();
  const user = getUser();

  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);

  // Get data from Redux
  const { messages, conversations, typingUsers, onlineUsers } = useSelector((state) => state.chat);
  const { getConversationMessages: messagesState, sendMessage: sendMessageState } = useSelector(
    (state) => state.chat
  );

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
    if (selectedChatId) {
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
    if (!message.trim() || !selectedChatId || !otherUser) return;

    const messageData = {
      conversation_id: selectedChatId,
      receiver_id: otherUser.id,
      content: message.trim(),
      message_type: "TEXT",
    };

    // Send via Redux (which will also trigger WebSocket)
    await dispatch(sendMessage(messageData));

    // Clear input
    setMessage("");

    // Stop typing indicator
    chatSocketService.stopTyping(selectedChatId, user.id, otherUser.id);
  }, [message, selectedChatId, otherUser, dispatch, user]);

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
  };
}

export default useInbox;
