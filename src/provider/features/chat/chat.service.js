import api from "@/common/utils/api";

// ==================== CONVERSATION ENDPOINTS ====================

// Create or get existing conversation
const createOrGetConversation = async (conversationData) => {
  const response = await api().post("/chat/conversations", conversationData);
  return response.data;
};

// Get all conversations for current user
const getUserConversations = async (filters = {}) => {
  const params = new URLSearchParams();

  if (filters.categories && filters.categories.length > 0) {
    params.append("categories", filters.categories.join(","));
  }
  if (filters.minRating && filters.minRating > 1) {
    params.append("minRating", filters.minRating);
  }
  if (filters.minRatingCount && filters.minRatingCount > 0) {
    params.append("minRatingCount", filters.minRatingCount);
  }
  if (filters.countries && filters.countries.length > 0) {
    params.append("countries", filters.countries.join(","));
  }
  if (filters.platforms && filters.platforms.length > 0) {
    params.append("platforms", filters.platforms.join(","));
  }

  const queryString = params.toString();
  const response = await api().get(`/chat/conversations${queryString ? `?${queryString}` : ""}`);
  return response.data;
};

// Get conversation by ID
const getConversationById = async (conversationId) => {
  const response = await api().get(`/chat/conversations/${conversationId}`);
  return response.data;
};

// Delete conversation
const deleteConversation = async (conversationId) => {
  const response = await api().delete(`/chat/conversations/${conversationId}`);
  return response.data;
};

// Clear conversation (delete all messages)
const clearConversation = async (conversationId) => {
  const response = await api().delete(`/chat/conversations/${conversationId}/clear`);
  return response.data;
};

// ==================== MESSAGE ENDPOINTS ====================

// Send a new message
const sendMessage = async (messageData) => {
  const response = await api().post("/chat/messages", messageData);
  return response.data;
};

// Get messages for a conversation
const getConversationMessages = async (conversationId, limit = 50, offset = 0) => {
  const response = await api().get(`/chat/conversations/${conversationId}/messages`, {
    params: { limit, offset },
  });
  return response.data;
};

// Mark message as delivered
const markMessageAsDelivered = async (messageId) => {
  const response = await api().post(`/chat/messages/${messageId}/delivered`);
  return response.data;
};

// Mark message as seen
const markMessageAsSeen = async (messageId) => {
  const response = await api().post(`/chat/messages/${messageId}/seen`);
  return response.data;
};

// Mark all messages in conversation as seen
const markConversationMessagesAsSeen = async (conversationId) => {
  console.log("🔵 API Service: Calling mark-seen endpoint for conversation:", conversationId);
  const response = await api().post("/chat/conversations/mark-seen", {
    conversation_id: conversationId,
  });
  console.log("🔵 API Service: Mark-seen response:", response.data);
  return response.data;
};

// Delete a message
const deleteMessage = async (messageId) => {
  const response = await api().delete(`/chat/messages/${messageId}`);
  return response.data;
};

// Delete multiple messages (batch)
const deleteMultipleMessages = async (messageIds) => {
  const response = await api().post("/chat/messages/delete-multiple", { messageIds });
  return response.data;
};

// Get total unread message count
const getUnreadCount = async () => {
  const response = await api().get("/chat/unread-count");
  return response.data;
};

// ==================== FILE UPLOAD ENDPOINTS ====================

// Upload file attachment
const uploadAttachment = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", "chat"); // Upload to chat folder

  const response = await api().post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

const chatService = {
  createOrGetConversation,
  getUserConversations,
  getConversationById,
  deleteConversation,
  clearConversation,
  sendMessage,
  getConversationMessages,
  markMessageAsDelivered,
  markMessageAsSeen,
  markConversationMessagesAsSeen,
  deleteMessage,
  deleteMultipleMessages,
  getUnreadCount,
  uploadAttachment,
};

export default chatService;
