import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import chatService from "./chat.service";

// Helper function to extract serializable error information
const getSerializableError = (error, defaultMessage) => {
  const errorMessage = error.response?.data?.message || error.message || defaultMessage;
  return { message: errorMessage };
};

const generalState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
  data: null,
};

const initialState = {
  createOrGetConversation: { ...generalState },
  getUserConversations: { ...generalState },
  getConversationById: { ...generalState },
  deleteConversation: { ...generalState },
  sendMessage: { ...generalState },
  getConversationMessages: { ...generalState },
  markMessageAsDelivered: { ...generalState },
  markMessageAsSeen: { ...generalState },
  markConversationMessagesAsSeen: { ...generalState },
  deleteMessage: { ...generalState },
  getUnreadCount: { ...generalState },

  // UI state
  activeConversationId: null,
  conversations: [],
  messages: {},
  onlineUsers: [], // Changed from Set to Array for Redux serialization
  typingUsers: {}, // Will store arrays instead of Sets
};

// ==================== CONVERSATION THUNKS ====================

export const createOrGetConversation = createAsyncThunk(
  "chat/createOrGetConversation",
  async (conversationData, thunkAPI) => {
    try {
      const response = await chatService.createOrGetConversation(conversationData);
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getSerializableError(error, "Failed to create or get conversation")
      );
    }
  }
);

export const getUserConversations = createAsyncThunk(
  "chat/getUserConversations",
  async (filters = {}, thunkAPI) => {
    try {
      const response = await chatService.getUserConversations(filters);
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(getSerializableError(error, "Failed to fetch conversations"));
    }
  }
);

export const getConversationById = createAsyncThunk(
  "chat/getConversationById",
  async (conversationId, thunkAPI) => {
    try {
      const response = await chatService.getConversationById(conversationId);
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(getSerializableError(error, "Failed to fetch conversation"));
    }
  }
);

export const deleteConversation = createAsyncThunk(
  "chat/deleteConversation",
  async (conversationId, thunkAPI) => {
    try {
      const response = await chatService.deleteConversation(conversationId);
      if (response.success) return { ...response, conversationId };
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(getSerializableError(error, "Failed to delete conversation"));
    }
  }
);

// ==================== MESSAGE THUNKS ====================

export const sendMessage = createAsyncThunk("chat/sendMessage", async (messageData, thunkAPI) => {
  try {
    const response = await chatService.sendMessage(messageData);
    if (response.success) return response;
    return thunkAPI.rejectWithValue(response);
  } catch (error) {
    return thunkAPI.rejectWithValue(getSerializableError(error, "Failed to send message"));
  }
});

export const getConversationMessages = createAsyncThunk(
  "chat/getConversationMessages",
  async ({ conversationId, limit, offset }, thunkAPI) => {
    try {
      const response = await chatService.getConversationMessages(conversationId, limit, offset);
      if (response.success) return { ...response, conversationId };
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(getSerializableError(error, "Failed to fetch messages"));
    }
  }
);

export const markMessageAsDelivered = createAsyncThunk(
  "chat/markMessageAsDelivered",
  async (messageId, thunkAPI) => {
    try {
      const response = await chatService.markMessageAsDelivered(messageId);
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getSerializableError(error, "Failed to mark message as delivered")
      );
    }
  }
);

export const markMessageAsSeen = createAsyncThunk(
  "chat/markMessageAsSeen",
  async (messageId, thunkAPI) => {
    try {
      const response = await chatService.markMessageAsSeen(messageId);
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getSerializableError(error, "Failed to mark message as seen")
      );
    }
  }
);

export const markConversationMessagesAsSeen = createAsyncThunk(
  "chat/markConversationMessagesAsSeen",
  async (conversationId, thunkAPI) => {
    try {
      const response = await chatService.markConversationMessagesAsSeen(conversationId);
      if (response.success) return { ...response, conversationId };
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getSerializableError(error, "Failed to mark messages as seen")
      );
    }
  }
);

export const deleteMessage = createAsyncThunk("chat/deleteMessage", async (messageId, thunkAPI) => {
  try {
    const response = await chatService.deleteMessage(messageId);
    if (response.success) return { ...response, messageId };
    return thunkAPI.rejectWithValue(response);
  } catch (error) {
    return thunkAPI.rejectWithValue(getSerializableError(error, "Failed to delete message"));
  }
});

export const getUnreadCount = createAsyncThunk("chat/getUnreadCount", async (_, thunkAPI) => {
  try {
    const response = await chatService.getUnreadCount();
    if (response.success) return response;
    return thunkAPI.rejectWithValue(response);
  } catch (error) {
    return thunkAPI.rejectWithValue(getSerializableError(error, "Failed to fetch unread count"));
  }
});

// ==================== SLICE ====================

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    // Set active conversation
    setActiveConversation: (state, action) => {
      state.activeConversationId = action.payload;
    },

    // Add message from WebSocket
    addMessageFromSocket: (state, action) => {
      const message = action.payload;
      const conversationId = message.conversation?.id || message.conversation_id;

      if (!conversationId) return;

      if (!state.messages[conversationId]) {
        state.messages[conversationId] = [];
      }

      // Add message if it doesn't exist
      const exists = state.messages[conversationId].some((m) => m.id === message.id);
      if (!exists) {
        state.messages[conversationId] = [...state.messages[conversationId], message];
        // Sort messages by created_at to maintain chronological order (create new array)
        state.messages[conversationId] = [...state.messages[conversationId]].sort((a, b) => {
          const dateA = new Date(a.created_at || a.createdAt || 0);
          const dateB = new Date(b.created_at || b.createdAt || 0);
          return dateA - dateB;
        });
      }

      // Update conversation last message
      const conversation = state.conversations.find((c) => c.id === conversationId);
      if (conversation) {
        conversation.last_message = message.content;
        conversation.last_message_at = message.created_at || message.createdAt;
      }
    },

    // Update message status from WebSocket
    updateMessageStatus: (state, action) => {
      const { messageId, status, deliveredAt, seenAt } = action.payload;

      // Find and update message in all conversations
      Object.keys(state.messages).forEach((conversationId) => {
        const messageIndex = state.messages[conversationId].findIndex((m) => m.id === messageId);
        if (messageIndex !== -1) {
          state.messages[conversationId][messageIndex].status = status;
          if (deliveredAt) {
            state.messages[conversationId][messageIndex].delivered_at = deliveredAt;
          }
          if (seenAt) {
            state.messages[conversationId][messageIndex].seen_at = seenAt;
          }
        }
      });
    },

    // Update all messages in conversation to SEEN
    updateConversationMessagesToSeen: (state, action) => {
      const { conversationId, seenAt } = action.payload;

      if (state.messages[conversationId]) {
        state.messages[conversationId] = state.messages[conversationId].map((message) => {
          if (message.status !== "SEEN") {
            return {
              ...message,
              status: "SEEN",
              seen_at: seenAt || new Date().toISOString(),
            };
          }
          return message;
        });
      }
    },

    // Set online users
    setOnlineUsers: (state, action) => {
      state.onlineUsers = Array.isArray(action.payload) ? action.payload : [];
    },

    // Add online user
    addOnlineUser: (state, action) => {
      if (!state.onlineUsers.includes(action.payload)) {
        state.onlineUsers.push(action.payload);
      }
    },

    // Remove online user
    removeOnlineUser: (state, action) => {
      state.onlineUsers = state.onlineUsers.filter((id) => id !== action.payload);
    },

    // Set typing user
    setTypingUser: (state, action) => {
      const { conversationId, userId, isTyping } = action.payload;
      if (!state.typingUsers[conversationId]) {
        state.typingUsers[conversationId] = [];
      }
      if (isTyping) {
        if (!state.typingUsers[conversationId].includes(userId)) {
          state.typingUsers[conversationId].push(userId);
        }
      } else {
        state.typingUsers[conversationId] = state.typingUsers[conversationId].filter(
          (id) => id !== userId
        );
      }
    },

    // Reset chat state
    resetChatState: (state) => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    // Create or get conversation
    builder
      .addCase(createOrGetConversation.pending, (state) => {
        state.createOrGetConversation.isLoading = true;
        state.createOrGetConversation.isError = false;
        state.createOrGetConversation.isSuccess = false;
        state.createOrGetConversation.data = null;
      })
      .addCase(createOrGetConversation.fulfilled, (state, action) => {
        state.createOrGetConversation.isLoading = false;
        state.createOrGetConversation.isSuccess = true;
        state.createOrGetConversation.data = action.payload.data;
        state.createOrGetConversation.message = action.payload.message;

        // Add to conversations if not exists
        const exists = state.conversations.some((c) => c.id === action.payload.data.id);
        if (!exists) {
          state.conversations.push(action.payload.data);
        }
      })
      .addCase(createOrGetConversation.rejected, (state, action) => {
        state.createOrGetConversation.isLoading = false;
        state.createOrGetConversation.isError = true;
        state.createOrGetConversation.message = action.payload?.message;
      });

    // Get user conversations
    builder
      .addCase(getUserConversations.pending, (state) => {
        state.getUserConversations.isLoading = true;
        state.getUserConversations.isError = false;
        state.getUserConversations.isSuccess = false;
      })
      .addCase(getUserConversations.fulfilled, (state, action) => {
        state.getUserConversations.isLoading = false;
        state.getUserConversations.isSuccess = true;
        state.getUserConversations.data = action.payload.data;
        state.getUserConversations.message = action.payload.message;
        state.conversations = action.payload.data || [];
      })
      .addCase(getUserConversations.rejected, (state, action) => {
        state.getUserConversations.isLoading = false;
        state.getUserConversations.isError = true;
        state.getUserConversations.message = action.payload?.message;
      });

    // Get conversation messages
    builder
      .addCase(getConversationMessages.pending, (state) => {
        state.getConversationMessages.isLoading = true;
        state.getConversationMessages.isError = false;
        state.getConversationMessages.isSuccess = false;
      })
      .addCase(getConversationMessages.fulfilled, (state, action) => {
        state.getConversationMessages.isLoading = false;
        state.getConversationMessages.isSuccess = true;
        state.getConversationMessages.data = action.payload.data;
        state.getConversationMessages.message = action.payload.message;

        // Store messages by conversation ID (sort chronologically)
        const conversationId = action.payload.conversationId;
        const fetchedMessages = action.payload.data || [];

        // Merge with existing messages, avoiding duplicates
        const existingMessages = state.messages[conversationId] || [];
        const existingIds = new Set(existingMessages.map((m) => m.id));

        const newMessages = fetchedMessages.filter((m) => !existingIds.has(m.id));
        const allMessages = [...existingMessages, ...newMessages];

        // Sort by created_at chronologically (create new array to avoid mutation)
        const sortedMessages = [...allMessages].sort((a, b) => {
          const dateA = new Date(a.created_at || a.createdAt || 0);
          const dateB = new Date(b.created_at || b.createdAt || 0);
          return dateA - dateB;
        });

        state.messages[conversationId] = sortedMessages;
      })
      .addCase(getConversationMessages.rejected, (state, action) => {
        state.getConversationMessages.isLoading = false;
        state.getConversationMessages.isError = true;
        state.getConversationMessages.message = action.payload?.message;
      });

    // Send message
    builder
      .addCase(sendMessage.pending, (state) => {
        state.sendMessage.isLoading = true;
        state.sendMessage.isError = false;
        state.sendMessage.isSuccess = false;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.sendMessage.isLoading = false;
        state.sendMessage.isSuccess = true;
        state.sendMessage.data = action.payload.data;
        state.sendMessage.message = action.payload.message;

        // Add message to conversation
        const message = action.payload.data;
        const conversationId = message.conversation?.id || message.conversation_id;

        if (!conversationId) return;

        if (!state.messages[conversationId]) {
          state.messages[conversationId] = [];
        }

        // Check if message already exists to prevent duplicates
        const exists = state.messages[conversationId].some((m) => m.id === message.id);
        if (!exists) {
          state.messages[conversationId] = [...state.messages[conversationId], message];
          // Sort messages by created_at to maintain chronological order (create new array)
          state.messages[conversationId] = [...state.messages[conversationId]].sort((a, b) => {
            const dateA = new Date(a.created_at || a.createdAt || 0);
            const dateB = new Date(b.created_at || b.createdAt || 0);
            return dateA - dateB;
          });
        }

        // Update conversation last message
        const conversation = state.conversations.find((c) => c.id === conversationId);
        if (conversation) {
          conversation.last_message = message.content;
          conversation.last_message_at = message.created_at || message.createdAt;
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.sendMessage.isLoading = false;
        state.sendMessage.isError = true;
        state.sendMessage.message = action.payload?.message;
      });

    // Delete conversation
    builder
      .addCase(deleteConversation.pending, (state) => {
        state.deleteConversation.isLoading = true;
        state.deleteConversation.isError = false;
        state.deleteConversation.isSuccess = false;
      })
      .addCase(deleteConversation.fulfilled, (state, action) => {
        state.deleteConversation.isLoading = false;
        state.deleteConversation.isSuccess = true;
        state.deleteConversation.message = action.payload.message;

        // Remove conversation
        state.conversations = state.conversations.filter(
          (c) => c.id !== action.payload.conversationId
        );

        // Remove messages
        delete state.messages[action.payload.conversationId];
      })
      .addCase(deleteConversation.rejected, (state, action) => {
        state.deleteConversation.isLoading = false;
        state.deleteConversation.isError = true;
        state.deleteConversation.message = action.payload?.message;
      });

    // Get unread count
    builder
      .addCase(getUnreadCount.pending, (state) => {
        state.getUnreadCount.isLoading = true;
        state.getUnreadCount.isError = false;
        state.getUnreadCount.isSuccess = false;
      })
      .addCase(getUnreadCount.fulfilled, (state, action) => {
        state.getUnreadCount.isLoading = false;
        state.getUnreadCount.isSuccess = true;
        state.getUnreadCount.data = action.payload.data;
        state.getUnreadCount.message = action.payload.message;
      })
      .addCase(getUnreadCount.rejected, (state, action) => {
        state.getUnreadCount.isLoading = false;
        state.getUnreadCount.isError = true;
        state.getUnreadCount.message = action.payload?.message;
      });
  },
});

export const {
  setActiveConversation,
  addMessageFromSocket,
  updateMessageStatus,
  updateConversationMessagesToSeen,
  setOnlineUsers,
  addOnlineUser,
  removeOnlineUser,
  setTypingUser,
  resetChatState,
} = chatSlice.actions;

export default chatSlice.reducer;
