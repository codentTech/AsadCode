import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBrandTasks } from "@/provider/features/campaign-tasks/campaign-tasks.slice";
import { getAllBrandCampaigns } from "@/provider/features/campaigns/campaigns.slice";
import { setSelectedCampaign as setSelectedCampaignContext } from "@/provider/features/campaign-context/campaign-context.slice";
import { TASK_TYPE, COLLABORATION_TYPE } from "@/common/constants/campaign.constant";

export default function useBrandTaskManager(show, selectedCampaignId = null, onClose = null) {
  const dispatch = useDispatch();

  const { brandTasks, getBrandTasks: getBrandTasksState } = useSelector(
    (state) => state.campaignTasks
  );

  const { data: campaignsData, isSuccess: campaignsListReady } = useSelector(
    (state) => state.campaigns.getAllBrandCampaigns || {}
  );

  const [selectedCampaign, setSelectedCampaign] = useState("all");

  const campaigns = campaignsData?.data?.campaigns || campaignsData?.data || [];

  const campaignOptions = useMemo(
    () => [
      { label: "All Campaigns", value: "all" },
      ...(campaigns || []).map((campaign) => ({
        label: campaign.campaign_title,
        value: campaign.id,
      })),
    ],
    [campaigns]
  );

  const selectedCampaignValue = useMemo(() => {
    if (selectedCampaign === "all") {
      return { label: "All Campaigns", value: "all" };
    }
    const campaign = campaigns.find((c) => c.id === selectedCampaign);
    return campaign
      ? { label: campaign.campaign_title, value: campaign.id }
      : { label: "All Campaigns", value: "all" };
  }, [selectedCampaign, campaigns]);

  const tasks = useMemo(() => {
    if (!brandTasks || !Array.isArray(brandTasks)) {
      return [];
    }
    if (selectedCampaign === "all") {
      return brandTasks;
    }
    return brandTasks.filter(
      (task) => task.campaign?.id === selectedCampaign || task.campaign_id === selectedCampaign
    );
  }, [brandTasks, selectedCampaign]);

  useEffect(() => {
    if (show) {
      setSelectedCampaign(selectedCampaignId || "all");
    }
  }, [show, selectedCampaignId]);

  useEffect(() => {
    if (!show) return;
    if (!campaignsListReady) {
      dispatch(getAllBrandCampaigns());
    }
  }, [show, dispatch, campaignsListReady]);

  useEffect(() => {
    if (show) {
      const campaignIdToFetch = selectedCampaignId || null;
      dispatch(getBrandTasks(campaignIdToFetch));
    }
  }, [show, selectedCampaignId, dispatch]);

  useEffect(() => {
    if (show && selectedCampaign !== (selectedCampaignId || "all")) {
      const campaignId = selectedCampaign === "all" ? null : selectedCampaign;
      dispatch(getBrandTasks(campaignId));
    }
  }, [selectedCampaign, show, dispatch, selectedCampaignId]);

  const handleCampaignSelect = ({ value }) => {
    setSelectedCampaign(value);
  };

  const formatName = (task) => {
    return task.task_name || "Untitled Task";
  };

  const getActionText = (task) => {
    switch (task.task_type) {
      case TASK_TYPE.REVIEW_DRAFT:
      case TASK_TYPE.REVIEW_REVISION:
        return "Review submission";
      case TASK_TYPE.VERIFY_POST:
        return "View post";
      case TASK_TYPE.MARK_COMPLETE:
        return "Mark complete";
      case TASK_TYPE.UNREAD_MESSAGE:
        return "View message";
      case TASK_TYPE.OVERDUE_ACTION:
        // According to spec: "Send {{Creator Name}} a message"
        const creatorName = task.creator
          ? task.creator.first_name && task.creator.last_name
            ? `${task.creator.first_name} ${task.creator.last_name}`
            : task.creator.email || "Creator"
          : "Creator";
        return `Send ${creatorName} a message`;
      case TASK_TYPE.RESOLVE_BLOCKED:
        return "View creator status";
      default:
        return "View task";
    }
  };

  const getPriority = (task) => {
    if (task.is_overdue) return "overdue";
    if (task.due_date) {
      const now = new Date();
      const dueDate = new Date(task.due_date);
      const hoursUntilDue = (dueDate - now) / (1000 * 60 * 60);
      if (hoursUntilDue < 24 && hoursUntilDue > 0) return "due-soon";
    }
    return "normal";
  };

  const handleTaskAction = (task) => {
    const campaignId = task.campaign?.id;
    const campaignFromTask = task.campaign;
    const creatorId = task.creator?.id;

    if (!campaignId) return;

    // Find the campaign in the loaded campaigns list
    const campaignInList = campaigns.find((c) => c.id === campaignId);
    const campaignToSelect = campaignInList || campaignFromTask;

    if (!campaignToSelect) return;

    const collaborationType = campaignToSelect.collaboration_type || null;
    const isIndividualCreator = collaborationType === COLLABORATION_TYPE.INDIVIDUAL_CREATOR;

    // Store creator ID and campaign ID in sessionStorage for auto-selection
    // This is used by use-active-brand.hook.js to automatically select the creator
    if (creatorId) {
      sessionStorage.setItem("taskCreatorId", creatorId);
      sessionStorage.setItem("taskCampaignId", campaignId);

      // Store task type for potential use in navigation
      if (task.task_type) {
        sessionStorage.setItem("taskType", task.task_type);
      }

      // Store conversation ID if it's a message task
      if (task.task_type === TASK_TYPE.UNREAD_MESSAGE && task.metadata?.conversation_id) {
        sessionStorage.setItem("taskConversationId", task.metadata.conversation_id);
      }
    }

    // Set campaign in context (Redux handles persistence)
    // This will trigger the restoration logic in use-active-brand.hook.js
    dispatch(
      setSelectedCampaignContext({
        campaignId: campaignId,
        collaborationType: collaborationType,
      })
    );

    // Store collaboration type in sessionStorage to help determine multi-creator vs individual
    // This ensures the correct toggle state is set when navigating
    if (isIndividualCreator) {
      sessionStorage.setItem("taskIsIndividualCreator", "true");
    } else {
      sessionStorage.setItem("taskIsIndividualCreator", "false");
    }

    // Close the modal after setting context
    // Using setTimeout to ensure Redux state updates first
    setTimeout(() => {
      if (onClose) {
        onClose();
      }
    }, 0);
  };

  return {
    selectedCampaign,
    selectedCampaignValue,
    tasks,
    campaignOptions,
    getBrandTasksState,
    handleCampaignSelect,
    handleTaskAction,
    getActionText,
    formatName,
    getPriority,
  };
}
