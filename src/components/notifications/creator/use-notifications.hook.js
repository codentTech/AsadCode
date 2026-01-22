import { useEffect, useCallback, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { getMyNotifications } from "@/provider/features/notification/notification.slice";
import notificationService from "@/provider/features/notification/notification.service";

const POLLING_INTERVAL = 30000; // 30 seconds

function useNotifications() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const pollingIntervalRef = useRef(null);

  const notificationsState = useSelector((state) => state.notification?.getMyNotifications);
  const notifications = notificationsState?.data?.data || [];
  const isLoading = notificationsState?.isLoading || false;

  // Fetch notifications
  const fetchNotifications = useCallback(
    async (showLoading = false) => {
      if (showLoading) {
        setIsRefreshing(true);
      }
      await dispatch(getMyNotifications()).unwrap();
      if (showLoading) {
        setIsRefreshing(false);
      }
    },
    [dispatch]
  );

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

  const markAsRead = useCallback(
    async (id) => {
      await notificationService.markAsRead(id);
      await fetchNotifications(false);
    },
    [fetchNotifications]
  );

  const removeNotification = useCallback(
    async (id) => {
      await notificationService.deleteNotification(id);
      await fetchNotifications(false);
    },
    [fetchNotifications]
  );

  const markAllAsRead = useCallback(async () => {
    await notificationService.markAllAsRead();
    await fetchNotifications(false);
  }, [fetchNotifications]);

  // Deep link handler for creator notifications
  const handleNotificationClick = useCallback(
    (notification) => {
      const data = notification.data || {};
      const campaignId = data.campaign_id || notification.campaign_id;
      const invitationId = data.invitation_id;
      const contractId = data.contract_id;
      const conversationId = data.conversation_id;

      // Navigate based on notification type
      switch (notification.type) {
        // Applications
        case "INVITATION":
        case "INVITE_EXPIRED":
          // Navigate to Applications tab -> Invites
          router.push(`/campaign?tab=4&application=1`);

          break;

        case "HIRE":
          // Navigate to Active tab
          router.push(`/campaign?tab=4`);

          break;

        case "REJECTION":
          // Navigate to Applications tab -> Rejected
          router.push(`/campaign?tab=4&application=4`);
          break;

        case "APPLICANT_WITHDREW":
          // Navigate to Applications tab
          router.push(`/campaign?tab=4`);
          break;

        // Contracts
        case "CONTRACT_CREATED":
        case "CONTRACT_READY_FOR_REVIEW":
          // Navigate to Applications tab -> Offers
          router.push(`/campaign?tab=4`);

          break;

        case "CONTRACT_SIGNED":
          // Navigate to Active tab
          router.push(`/campaign?tab=2`);

          break;

        // Active Collaboration
        case "DELIVERABLE_SUBMITTED":
        case "DRAFT_SUBMITTED":
        case "POST_SUBMITTED":
        case "DELIVERABLE_APPROVED":
        case "DRAFT_APPROVED":
        case "REVISION_APPROVED":
        case "DELIVERABLE_REJECTED":
        case "REVISION_REQUESTED":
        case "DELIVERABLE_OVERDUE":
        case "DEADLINE_MISSED":
        case "DELIVERABLE_DUE_SOON":
        case "DEADLINE_REMINDER":
        case "CREATOR_MARKED_DELAYED":
          // Navigate to Active tab -> Campaign -> Timeline/Deliverables
          router.push(`/campaign?tab=2`);

          break;

        // Completed
        case "PAYMENT_RELEASED":
        case "CAMPAIGN_COMPLETE":
        case "COLLABORATION_COMPLETED":
        case "REVIEW":
        case "REVIEW_RECEIVED":
        case "PERFORMANCE_METRICS_UPDATED":
          // Navigate to Completed tab
          router.push(`/campaign?tab=3`);
          break;

        // Payment Issues
        case "PAYMENT_FAILED":
        case "PAYOUT_ACTION_NEEDED":
          // Navigate to Settings -> Payments
          router.push(`/settings/payments`);
          break;

        case "PAYOUT_UPDATED":
          // Navigate to Settings -> Payments
          router.push(`/settings/payments`);
          break;

        // Rejected/Removed
        case "CREATOR_REMOVED":
          // Navigate to Applications tab
          router.push(`/campaign?tab=4`);
          break;

        case "DISPUTE_RESOLVED":
          // Navigate to relevant page (could be campaign or settings)
          router.push(campaignId ? `/campaign?tab=2&campaignId=${campaignId}` : `/campaign`);
          break;

        // General
        case "PLATFORM_ANNOUNCEMENT":
        case "TERMS_UPDATED":
          // Stay on notifications or navigate to relevant page
          break;

        case "SECURITY_ALERT":
        case "PASSWORD_CHANGED":
          // Navigate to Settings
          router.push(`/settings`);
          break;

        default:
          // Default: navigate to Active tab with campaign if available
          if (campaignId) {
            router.push(`/campaign?tab=2`);
          } else {
            router.push(`/campaign`);
          }
          break;
      }
    },
    [router]
  );

  return {
    notifications,
    isLoading,
    isRefreshing,
    refreshNotifications,
    markAsRead,
    removeNotification,
    markAllAsRead,
    handleNotificationClick,
  };
}

export default useNotifications;
