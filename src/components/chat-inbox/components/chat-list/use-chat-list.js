import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserConversations } from "@/provider/features/chat/chat.slice";
import { getUser } from "@/common/utils/users.util";
import { avatar } from "@/common/constants/auth.constant";

function useChatList(selectedChatId, setSelectedChatId, activeTab) {
  const dispatch = useDispatch();
  const user = getUser();

  const [activeFilter, setActiveFilter] = useState("Saved");
  const [openFilterModal, setOpenFilterModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter states
  const [filters, setFilters] = useState({
    categories: [],
    minRating: 1,
    minRatingCount: 0,
    countries: [],
    platforms: [],
  });

  // Get conversations from Redux with safety checks
  const chatState = useSelector((state) => state.chat) || {};
  const conversations = chatState.conversations || [];
  const onlineUsers = chatState.onlineUsers || [];
  const conversationsState = chatState.getUserConversations || {};

  const filterOptions = ["Saved", "Rejected"];

  // Fetch conversations on mount
  useEffect(() => {
    if (user?.id) {
      dispatch(getUserConversations());
    }
  }, [dispatch, user?.id]);

  // (moved chats-based effect below, after chats is declared)

  // Helper function to determine if conversation is in "My Network"
  const isInMyNetwork = (conversation) => {
    const messageCount = conversation.message_count || 0;
    const firstSenderId = conversation.first_message_sender_id;
    const hasWorkedTogether = !!conversation.campaign; // If there's a campaign, they've worked together

    // Criteria for "My Network":
    // 1. They've worked together before (has campaign)
    // 2. Both parties have sent messages (message_count > 1)
    // 3. Current user initiated the conversation (sent first message)
    const iInitiatedConversation = firstSenderId === user?.id;
    const hasBothSentMessages = messageCount > 1;

    return hasWorkedTogether || hasBothSentMessages || iInitiatedConversation;
  };

  // Transform conversations to chat list format
  const allChats = conversations
    .filter((conversation) => {
      // Filter out self-conversations (where user is both brand and creator)
      return conversation.brand.id !== conversation.creator.id;
    })
    .map((conversation) => {
      // Determine the other user (not current user)
      const isUserBrand = conversation.brand.id === user?.id;
      const otherUser = isUserBrand ? conversation.creator : conversation.brand;

      // Get unread count for current user
      const unreadCount = isUserBrand
        ? conversation.brand_unread_count
        : conversation.creator_unread_count;

      // Check if other user is online
      const isOnline = onlineUsers.includes(otherUser.id);

      // Format time
      const formatTime = (timestamp) => {
        if (!timestamp) return "";
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 60) {
          return `${diffMins}m ago`;
        } else if (diffHours < 24) {
          return `${diffHours}h ago`;
        } else if (diffDays === 1) {
          return "Yesterday";
        } else if (diffDays < 7) {
          return `${diffDays}d ago`;
        } else {
          return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        }
      };

      return {
        id: conversation.id,
        name: `${otherUser.first_name || ""} ${otherUser.last_name || ""}`.trim() || "User",
        message: conversation.last_message || "No messages yet",
        time: formatTime(conversation.last_message_at),
        avatar:
          otherUser.creator_profile?.profile_photo_url ||
          otherUser.brand_profile?.logo_url ||
          avatar,
        unread: unreadCount > 0,
        unreadCount,
        online: isOnline,
        me: false, // This would be determined by checking if last message sender is current user
        otherUserId: otherUser.id,
        campaignId: conversation.campaign?.id,
        isInMyNetwork: isInMyNetwork(conversation),
      };
    });

  // Filter chats based on activeTab and search query
  // (Other filters are applied server-side when "Apply Filters" is clicked)
  const chats = allChats.filter((chat) => {
    // Filter by tab (My Network = 4, Message Requests = 5)
    const matchesTab = activeTab === 4 ? chat.isInMyNetwork : !chat.isInMyNetwork;

    // Filter by search query
    const matchesSearch =
      chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.message.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  // Auto-select first conversation when conversations load, but only if there are conversations for the current tab
  useEffect(() => {
    if (chats.length > 0 && !selectedChatId && setSelectedChatId) {
      setSelectedChatId(chats[0].id);
    } else if (chats.length === 0 && selectedChatId && setSelectedChatId) {
      // Clear selected chat if no conversations match the current tab
      setSelectedChatId(null);
    }
  }, [chats, selectedChatId, setSelectedChatId]);

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  // Handle checkbox filters (countries, platforms)
  const handleCheckboxFilter = (filterType, value, checked) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: checked
        ? [...prev[filterType], value]
        : prev[filterType].filter((item) => item !== value),
    }));
  };

  // Handle niche selection
  const handleNicheChange = (niche) => {
    if (niche === "all") {
      setFilters((prev) => ({
        ...prev,
        categories: [],
      }));
    } else {
      setFilters((prev) => ({
        ...prev,
        categories: [niche],
      }));
    }
  };

  // Reset filters
  const handleResetFilters = () => {
    const resetFilters = {
      categories: [],
      minRating: 1,
      minRatingCount: 0,
      countries: [],
      platforms: [],
    };
    setFilters(resetFilters);

    // Refetch conversations without filters
    if (user?.id) {
      dispatch(getUserConversations({}));
    }
  };

  // Apply filters and close modal
  const handleApplyFilters = () => {
    // Fetch conversations with filters from backend
    if (user?.id) {
      dispatch(getUserConversations(filters));
    }
    setOpenFilterModal(false);
  };

  // Get active filter count
  const activeFilterCount =
    (filters.categories.length > 0 ? 1 : 0) +
    (filters.minRating > 1 ? 1 : 0) +
    (filters.minRatingCount > 0 ? 1 : 0) +
    (filters.countries.length > 0 ? 1 : 0) +
    (filters.platforms.length > 0 ? 1 : 0);

  return {
    filterOptions,
    chats,
    activeFilter,
    setActiveFilter,
    openFilterModal,
    setOpenFilterModal,
    isLoading: conversationsState.isLoading,
    searchQuery,
    setSearchQuery,
    filters,
    handleFilterChange,
    handleCheckboxFilter,
    handleNicheChange,
    handleResetFilters,
    handleApplyFilters,
    activeFilterCount,
  };
}

export default useChatList;
