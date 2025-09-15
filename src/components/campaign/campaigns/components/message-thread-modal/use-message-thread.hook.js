import { useState, useCallback, useRef } from "react";

/**
 * Custom hook for managing message thread functionality
 * Handles loading messages, pagination, sending new messages, and scroll behavior
 */
const useMessageThread = (creatorId) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [error, setError] = useState(null);

  // Pagination
  const [page, setPage] = useState(1);
  const [totalMessages, setTotalMessages] = useState(0);

  // Refs
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  /**
   * Opens the message modal and loads initial messages
   */
  const openMessageModal = useCallback(async () => {
    setIsModalOpen(true);
    setError(null);
    await loadMessages(true); // Load initial messages
  }, [creatorId]);

  /**
   * Closes the message modal and resets state
   */
  const closeMessageModal = useCallback(() => {
    setIsModalOpen(false);
    setMessages([]);
    setNewMessage("");
    setPage(1);
    setHasMoreMessages(true);
    setError(null);
  }, []);

  /**
   * Loads messages with pagination support
   * @param {boolean} isInitial - Whether this is the initial load
   */
  const loadMessages = useCallback(
    async (isInitial = false) => {
      if (isLoading && !isInitial) return;

      setIsLoading(true);

      try {
        // TODO: Replace with actual API call
        // const response = await messageApi.getMessages(creatorId, page);

        // Mock API response for demonstration
        const mockResponse = await simulateApiCall(isInitial ? 1 : page);

        if (isInitial) {
          setMessages(mockResponse.messages);
          setPage(2);
          scrollToBottom();
        } else {
          // Prepend older messages for lazy loading
          setMessages((prev) => [...mockResponse.messages, ...prev]);
          setPage((prev) => prev + 1);
        }

        setTotalMessages(mockResponse.total);
        setHasMoreMessages(mockResponse.hasMore);
      } catch (err) {
        setError("Failed to load messages. Please try again.");
        console.error("Error loading messages:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [creatorId, page, isLoading]
  );

  /**
   * Mock API call - Replace with actual API implementation
   */
  const simulateApiCall = async (pageNum) => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const allMessages = [
      {
        id: 1,
        text: "Thanks for accepting our collaboration proposal! We're excited to work with you.",
        sender: "brand",
        timestamp: "2025-01-14T16:00:00Z",
        status: "read",
      },
      {
        id: 2,
        text: "Hi Sam! Looking forward to working with you on this campaign. When can we schedule a call to discuss the details?",
        sender: "brand",
        timestamp: "2025-01-15T10:00:00Z",
        status: "read",
      },
      {
        id: 3,
        text: "Hello! Great to connect with you. I'm available for a call tomorrow afternoon or Thursday morning. What works best for your schedule?",
        sender: "creator",
        timestamp: "2025-01-15T10:30:00Z",
        status: "read",
      },
      {
        id: 4,
        text: "Perfect! Let's do Thursday morning at 10 AM. I'll send you the meeting link shortly.",
        sender: "brand",
        timestamp: "2025-01-15T11:00:00Z",
        status: "read",
      },
      {
        id: 5,
        text: "Sounds great! I'll be ready. Also, I had a few creative ideas for the Instagram video that I'd love to share with you during our call.",
        sender: "creator",
        timestamp: "2025-01-15T11:15:00Z",
        status: "read",
      },
      {
        id: 6,
        text: "That's exactly what I was hoping to hear! Your creativity is why we chose to work with you. See you Thursday!",
        sender: "brand",
        timestamp: "2025-01-15T11:20:00Z",
        status: "read",
      },
      {
        id: 7,
        text: "Just finished recording the first draft of the Instagram video! It turned out better than expected. I'll send you the preview link in a few minutes.",
        sender: "creator",
        timestamp: "2025-01-18T14:30:00Z",
        status: "read",
      },
      {
        id: 8,
        text: "Wow! I just watched it and it's absolutely perfect! The lighting, the messaging, everything is spot on. No revisions needed - this is exactly what we envisioned.",
        sender: "brand",
        timestamp: "2025-01-18T15:45:00Z",
        status: "delivered",
      },
    ];

    const messagesPerPage = 6;
    const startIndex = (pageNum - 1) * messagesPerPage;
    const endIndex = startIndex + messagesPerPage;
    const pageMessages = allMessages.slice(startIndex, endIndex);

    return {
      messages: pageMessages,
      total: allMessages.length,
      hasMore: endIndex < allMessages.length,
      page: pageNum,
    };
  };

  /**
   * Sends a new message
   * @param {string} messageText - The message to send
   */
  const sendMessage = useCallback(
    async (messageText) => {
      if (!messageText.trim() || isSending) return;

      const tempMessage = {
        id: `temp_${Date.now()}`,
        text: messageText.trim(),
        sender: "brand",
        timestamp: new Date().toISOString(),
        status: "sending",
      };

      // Optimistically add message to UI
      setMessages((prev) => [...prev, tempMessage]);
      setNewMessage("");
      setIsSending(true);
      scrollToBottom();

      try {
        // TODO: Replace with actual API call
        // const response = await messageApi.sendMessage(creatorId, messageText);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Replace temp message with actual message
        const actualMessage = {
          ...tempMessage,
          id: Date.now(), // Would be from API response
          status: "delivered",
        };

        setMessages((prev) => prev.map((msg) => (msg.id === tempMessage.id ? actualMessage : msg)));

        // Simulate message being read after a delay
        setTimeout(() => {
          setMessages((prev) =>
            prev.map((msg) => (msg.id === actualMessage.id ? { ...msg, status: "read" } : msg))
          );
        }, 2000);
      } catch (err) {
        // Remove failed message and show error
        setMessages((prev) => prev.filter((msg) => msg.id !== tempMessage.id));
        setError("Failed to send message. Please try again.");
        console.error("Error sending message:", err);
      } finally {
        setIsSending(false);
      }
    },
    [creatorId, isSending]
  );

  /**
   * Handles scroll to load more messages (lazy loading)
   */
  const handleScroll = useCallback(
    (e) => {
      const { scrollTop } = e.target;

      // Load more messages when scrolled to top
      if (scrollTop === 0 && hasMoreMessages && !isLoading) {
        loadMessages(false);
      }
    },
    [hasMoreMessages, isLoading, loadMessages]
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
   * Marks messages as read (when modal is opened)
   */
  const markMessagesAsRead = useCallback(async () => {
    try {
      // TODO: Replace with actual API call
      // await messageApi.markAsRead(creatorId);

      setMessages((prev) => prev.map((msg) => ({ ...msg, status: "read" })));
    } catch (err) {
      console.error("Error marking messages as read:", err);
    }
  }, [creatorId]);

  /**
   * Clears error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Handles message input change
   */
  const handleMessageChange = useCallback((value) => {
    setNewMessage(value);
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
    isLoading,
    isSending,
    hasMoreMessages,

    // Error handling
    error,
    clearError,

    // Actions
    sendMessage,
    loadMessages,
    handleScroll,
    markMessagesAsRead,

    // Refs
    messagesEndRef,
    messagesContainerRef,

    // Utilities
    formatMessageTime,
    scrollToBottom,

    // Pagination info
    page,
    totalMessages,
  };
};

export default useMessageThread;
