"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import chatSocketService from "./features/chat/chat-socket.service";
import { getUser } from "@/common/utils/users.util";

/**
 * Global Chat Provider - Initializes WebSocket connection for real-time messaging
 * This component should be placed at the root level to ensure chat works everywhere
 */
export default function ChatProvider({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const user = getUser();

    // Only connect if user is logged in
    if (user && user.id) {
      console.log("🔌 Initializing global chat WebSocket connection...");
      chatSocketService.connect(dispatch);

      // Cleanup on unmount
      return () => {
        console.log("🔌 Disconnecting global chat WebSocket...");
        chatSocketService.disconnect();
      };
    }
  }, [dispatch]);

  return <>{children}</>;
}
