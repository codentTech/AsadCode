import { notificationsMockData } from "@/common/constants/notifications.data.constant";
import { useState } from "react";

function useNotifications() {
  const [notifications, setNotifications] = useState(notificationsMockData);

  const markAsRead = (id) => {
    setNotifications((prev) => ({
      ...prev,
      ["brand"]: prev["brand"].map((notif) =>
        notif.id === id ? { ...notif, unread: false } : notif
      ),
    }));
  };

  const removeNotification = (id) => {
    setNotifications((prev) => ({
      ...prev,
      ["brand"]: prev["brand"].filter((notif) => notif.id !== id),
    }));
  };
  return { notifications, markAsRead, removeNotification };
}

export default useNotifications;
