import { useEffect, useCallback, useRef, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import {
  getMyNotifications,
  getActionRequiredNotifications,
} from "@/provider/features/notification/notification.slice";
import { getAllBrandCampaigns } from "@/provider/features/campaigns/campaigns.slice";
import { setSelectedCampaign } from "@/provider/features/campaign-context/campaign-context.slice";
import notificationService from "@/provider/features/notification/notification.service";
import {
  getNotificationSection,
  NOTIFICATION_SECTION,
} from "@/common/utils/notification-categorizer.util";

const POLLING_INTERVAL = 30000; // 30 seconds

function useNotificationsBrand() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const pollingIntervalRef = useRef(null);

  // Campaign context
  const { selectedCampaignId } = useSelector((state) => state.campaignContext || {});
  const [selectedCampaignIdLocal, setSelectedCampaignIdLocal] = useState(
    selectedCampaignId || null
  );

  // Campaigns
  const {
    isLoading: campaignsLoading,
    isSuccess: campaignsSuccess,
    data: campaignsData,
  } = useSelector((state) => state.campaigns.getAllBrandCampaigns || {});

  // Notifications
  const notificationsState = useSelector((state) => state.notification?.getMyNotifications);
  const actionRequiredState = useSelector(
    (state) => state.notification?.getActionRequiredNotifications
  );

  const eventNotifications = notificationsState?.data?.data || [];
  const actionRequiredNotifications = actionRequiredState?.data?.data || [];
  const isLoading = notificationsState?.isLoading || actionRequiredState?.isLoading || false;

  // Campaign options
  const campaignOptions = useMemo(() => {
    if (!campaignsSuccess || !campaignsData?.data) return [];
    const allCampaigns = Array.isArray(campaignsData.data) ? campaignsData.data : [];
    const activeCampaigns = allCampaigns.filter((campaign) => campaign.status !== "COMPLETE");

    // Add "All Campaigns" option at the beginning
    return [
      {
        value: "all",
        label: "All Campaigns",
        campaign: null,
      },
      ...activeCampaigns.map((campaign) => ({
        value: campaign.id,
        label: campaign.campaign_title || "Untitled Campaign",
        campaign: campaign,
      })),
    ];
  }, [campaignsSuccess, campaignsData]);

  // Auto-select most recent campaign on first load (skip "All Campaigns" option)
  useEffect(() => {
    if (
      campaignsSuccess &&
      campaignOptions.length > 1 && // More than just "All Campaigns"
      !selectedCampaignIdLocal &&
      !selectedCampaignId
    ) {
      // Skip first option ("All Campaigns") and select the first actual campaign
      const mostRecent = campaignOptions[1];
      if (mostRecent && mostRecent.value !== "all") {
        setSelectedCampaignIdLocal(mostRecent.value);
        dispatch(
          setSelectedCampaign({
            campaignId: mostRecent.value,
            collaborationType: mostRecent.campaign?.collaboration_type || null,
          })
        );
      }
    }
  }, [campaignsSuccess, campaignOptions, selectedCampaignIdLocal, selectedCampaignId, dispatch]);

  // Restore from context
  useEffect(() => {
    if (selectedCampaignId && !selectedCampaignIdLocal) {
      setSelectedCampaignIdLocal(selectedCampaignId);
    }
  }, [selectedCampaignId, selectedCampaignIdLocal]);

  // Fetch campaigns
  useEffect(() => {
    dispatch(getAllBrandCampaigns());
  }, [dispatch]);

  // Fetch notifications
  const fetchNotifications = useCallback(
    async (showLoading = false) => {
      if (showLoading) {
        setIsRefreshing(true);
      }
      // If "all" is selected, don't pass campaignId (undefined = all campaigns)
      const campaignId = selectedCampaignIdLocal === "all" ? undefined : selectedCampaignIdLocal;
      await Promise.all([
        dispatch(getMyNotifications(campaignId)),
        dispatch(getActionRequiredNotifications(campaignId)),
      ]);
      if (showLoading) {
        setIsRefreshing(false);
      }
    },
    [dispatch, selectedCampaignIdLocal]
  );

  // Initial fetch (handles both "all" and specific campaign IDs)
  useEffect(() => {
    if (selectedCampaignIdLocal !== null) {
      fetchNotifications();
    }
  }, [fetchNotifications, selectedCampaignIdLocal]);

  // Setup polling
  useEffect(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = null;
        }
      } else {
        if (!pollingIntervalRef.current && selectedCampaignIdLocal !== null) {
          pollingIntervalRef.current = setInterval(() => {
            fetchNotifications(false);
          }, POLLING_INTERVAL);
        }
      }
    };

    // Start polling if page is visible (campaignId can be "all" or a specific campaign ID)
    if (!document.hidden && selectedCampaignIdLocal !== null) {
      pollingIntervalRef.current = setInterval(() => {
        fetchNotifications(false);
      }, POLLING_INTERVAL);
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [fetchNotifications, selectedCampaignIdLocal]);

  // Categorize event notifications
  const categorizedNotifications = useMemo(() => {
    const categorized = {
      [NOTIFICATION_SECTION.ACTION_REQUIRED]: [],
      [NOTIFICATION_SECTION.EXECUTION_UPDATES]: [],
      [NOTIFICATION_SECTION.APPLICATIONS]: [],
      [NOTIFICATION_SECTION.OTHER_UPDATES]: [],
    };

    eventNotifications.forEach((notification) => {
      const section = getNotificationSection(notification.type);
      categorized[section].push(notification);
    });

    // Sort each section
    categorized[NOTIFICATION_SECTION.EXECUTION_UPDATES].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
    categorized[NOTIFICATION_SECTION.APPLICATIONS].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
    categorized[NOTIFICATION_SECTION.OTHER_UPDATES].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );

    return categorized;
  }, [eventNotifications]);

  // Handle campaign change
  const handleCampaignChange = useCallback(
    (option) => {
      // SimpleSelect passes the option object, not just the value
      const campaignId = typeof option === "object" ? option.value : option;
      setSelectedCampaignIdLocal(campaignId);
      const selectedCampaign = campaignOptions.find((opt) => opt.value === campaignId);

      if (campaignId === "all") {
        // Clear context when "All Campaigns" is selected
        dispatch(
          setSelectedCampaign({
            campaignId: null,
            collaborationType: null,
          })
        );
      } else if (selectedCampaign && selectedCampaign.campaign) {
        // Update context when a specific campaign is selected
        dispatch(
          setSelectedCampaign({
            campaignId: campaignId,
            collaborationType: selectedCampaign.campaign.collaboration_type || null,
          })
        );
      }
    },
    [dispatch, campaignOptions]
  );

  // Manual refresh
  const refreshNotifications = useCallback(async () => {
    await fetchNotifications(true);
  }, [fetchNotifications]);

  // Mark as read
  const markAsRead = useCallback(
    async (id) => {
      await notificationService.markAsRead(id);
      await fetchNotifications(false);
    },
    [fetchNotifications]
  );

  // Dismiss notification (only for non-Action Required)
  const dismissNotification = useCallback(
    async (id) => {
      await notificationService.deleteNotification(id);
      await fetchNotifications(false);
    },
    [fetchNotifications]
  );

  // Mark all as read
  const markAllAsRead = useCallback(async () => {
    await notificationService.markAllAsRead();
    await fetchNotifications(false);
  }, [fetchNotifications]);

  // Deep link handlers
  const handleNotificationClick = useCallback(
    (notification) => {
      const data = notification.data || {};
      const campaignId = data.campaign_id || notification.campaign_id;
      const creatorId = data.creator_id;

      if (!campaignId) return;

      router.push(`/campaign`);
    },
    [router]
  );

  return {
    // Campaign
    campaignOptions,
    selectedCampaignId: selectedCampaignIdLocal,
    handleCampaignChange,
    campaignsLoading,

    // Notifications
    actionRequiredNotifications,
    categorizedNotifications,
    isLoading,
    isRefreshing,

    // Actions
    refreshNotifications,
    markAsRead,
    dismissNotification,
    markAllAsRead,
    handleNotificationClick,
  };
}

export default useNotificationsBrand;

