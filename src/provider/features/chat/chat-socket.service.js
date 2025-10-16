import { io } from "socket.io-client";
import { getUser } from "@/common/utils/users.util";

class ChatSocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.joinedRooms = new Set(); // Track joined conversation rooms
  }

  // Initialize WebSocket connection
  connect(dispatch) {
    // Prevent multiple connections
    if (this.socket && this.isConnected) {
      console.log("⚠️ WebSocket already connected, skipping...");
      return;
    }

    const user = getUser();
    if (!user || !user.id) {
      console.error("❌ User not found, cannot connect to chat");
      return;
    }

    const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000/chat";

    console.log(`🔌 Connecting to WebSocket: ${SOCKET_URL} with userId: ${user.id}`);

    this.socket = io(SOCKET_URL, {
      query: { userId: user.id },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.setupEventListeners(dispatch);
  }

  // Setup all event listeners
  setupEventListeners(dispatch) {
    if (!this.socket) return;

    // Remove all existing listeners to prevent duplicates
    this.socket.removeAllListeners();

    // Connection events
    this.socket.on("connect", () => {
      console.log("✅ Connected to chat server");
      this.isConnected = true;
    });

    this.socket.on("disconnect", () => {
      console.log("❌ Disconnected from chat server");
      this.isConnected = false;
    });

    this.socket.on("connect_error", (error) => {
      console.error("Connection error:", error);
    });

    // Message events
    this.socket.on("message_sent", (message) => {
      // Message already added via Redux thunk
    });

    this.socket.on("new_message", (message) => {
      if (dispatch) {
        const user = getUser();
        // Only add messages from other users (sender's messages are already added via sendMessage.fulfilled)
        if (message.sender_id !== user?.id) {
          const { addMessageFromSocket } = require("./chat.slice");
          dispatch(addMessageFromSocket(message));
        }
      }
    });

    this.socket.on("message_delivered", ({ messageId, deliveredAt }) => {
      if (dispatch) {
        const { updateMessageStatus } = require("./chat.slice");
        dispatch(
          updateMessageStatus({
            messageId,
            status: "DELIVERED",
            deliveredAt,
          })
        );
      }
    });

    this.socket.on("messages_seen", ({ conversationId, seenBy, seenAt }) => {
      if (dispatch) {
        const { updateConversationMessagesToSeen } = require("./chat.slice");
        dispatch(updateConversationMessagesToSeen({ conversationId, seenAt }));
      }
    });

    // Typing events
    this.socket.on("user_typing", ({ conversationId, userId, isTyping }) => {
      if (dispatch) {
        const { setTypingUser } = require("./chat.slice");
        dispatch(setTypingUser({ conversationId, userId, isTyping }));
      }
    });

    // Online status events
    this.socket.on("user_status_changed", ({ userId, isOnline, timestamp }) => {
      if (dispatch) {
        const { addOnlineUser, removeOnlineUser } = require("./chat.slice");
        if (isOnline) {
          dispatch(addOnlineUser(userId));
        } else {
          dispatch(removeOnlineUser(userId));
        }
      }
    });

    // Error events
    this.socket.on("message_error", ({ error }) => {
      console.error("❌ Message error:", error);
    });

    this.socket.on("mark_seen_error", ({ error }) => {
      console.error("❌ Mark seen error:", error);
    });
  }

  // Send message via WebSocket
  sendMessage(messageData, user) {
    if (!this.socket || !this.isConnected) {
      console.error("Socket not connected");
      return;
    }

    this.socket.emit("send_message", {
      message: messageData,
      user: { id: user.id },
    });
  }

  // Mark messages as seen
  markAsSeen(conversationId, user) {
    if (!this.socket || !this.isConnected) {
      console.error("Socket not connected");
      return;
    }

    this.socket.emit("mark_as_seen", {
      conversationId,
      user: { id: user.id },
    });
  }

  // Start typing indicator
  startTyping(conversationId, userId, receiverId) {
    if (!this.socket || !this.isConnected) return;

    this.socket.emit("typing_start", {
      conversationId,
      userId,
      receiverId,
    });
  }

  // Stop typing indicator
  stopTyping(conversationId, userId, receiverId) {
    if (!this.socket || !this.isConnected) return;

    this.socket.emit("typing_stop", {
      conversationId,
      userId,
      receiverId,
    });
  }

  // Join conversation room
  joinConversation(conversationId) {
    if (!this.socket || !this.isConnected) return;

    // Prevent joining the same room multiple times
    if (this.joinedRooms.has(conversationId)) {
      console.log(`⚠️ Already joined conversation room: ${conversationId}`);
      return;
    }

    console.log(`🔗 Joining conversation room: ${conversationId}`);
    this.socket.emit("join_conversation", { conversationId });
    this.joinedRooms.add(conversationId);
  }

  // Leave conversation room
  leaveConversation(conversationId) {
    if (!this.socket || !this.isConnected) return;

    console.log(`👋 Leaving conversation room: ${conversationId}`);
    this.socket.emit("leave_conversation", { conversationId });
    this.joinedRooms.delete(conversationId);
  }

  // Disconnect socket
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.joinedRooms.clear(); // Clear joined rooms on disconnect
    }
  }

  // Check if connected
  isSocketConnected() {
    return this.isConnected && this.socket?.connected;
  }
}

// Create singleton instance
const chatSocketService = new ChatSocketService();

export default chatSocketService;
