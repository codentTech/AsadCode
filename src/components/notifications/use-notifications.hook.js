import { useEffect, useCallback, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMyNotifications } from "@/provider/features/notification/notification.slice";
import notificationService from "@/provider/features/notification/notification.service";

const POLLING_INTERVAL = 30000; // 30 seconds

function useNotifications() {
  const dispatch = useDispatch();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const pollingIntervalRef = useRef(null);

  const notificationsState = useSelector((state) => state.notification?.getMyNotifications);
  const notifications = notificationsState?.data?.data || [];
  const isLoading = notificationsState?.isLoading || false;

  // Fetch notifications
  const fetchNotifications = useCallback(async (showLoading = false) => {
    if (showLoading) {
      setIsRefreshing(true);
    }
    await dispatch(getMyNotifications()).unwrap();
    if (showLoading) {
      setIsRefreshing(false);
    }
  }, [dispatch]);

  // Initial fetch
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Setup polling
  useEffect(() => {
    // Clear any existing interval
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }

    // Setup polling only when page is visible
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Page is hidden, stop polling
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = null;
        }
      } else {
        // Page is visible, start polling
        if (!pollingIntervalRef.current) {
          pollingIntervalRef.current = setInterval(() => {
            fetchNotifications(false); // Silent refresh
          }, POLLING_INTERVAL);
        }
      }
    };

    // Start polling if page is visible
    if (!document.hidden) {
      pollingIntervalRef.current = setInterval(() => {
        fetchNotifications(false); // Silent refresh
      }, POLLING_INTERVAL);
    }

    // Listen for visibility changes
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Cleanup on unmount
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [fetchNotifications]);

  // Manual refresh function
  const refreshNotifications = useCallback(async () => {
    await fetchNotifications(true);
  }, [fetchNotifications]);

  const markAsRead = useCallback(async (id) => {
    await notificationService.markAsRead(id);
    await fetchNotifications(false);
  }, [fetchNotifications]);

  const removeNotification = useCallback(async (id) => {
    await notificationService.deleteNotification(id);
    await fetchNotifications(false);
  }, [fetchNotifications]);

  const markAllAsRead = useCallback(async () => {
    await notificationService.markAllAsRead();
    await fetchNotifications(false);
  }, [fetchNotifications]);

  return {
    notifications,
    isLoading,
    isRefreshing,
    refreshNotifications,
    markAsRead,
    removeNotification,
    markAllAsRead,
  };
}

export default useNotifications;
