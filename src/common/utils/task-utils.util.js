import { TASK_TYPE } from "@/common/constants/campaign.constant";

/**
 * Get action button text for a task type
 */
export const getTaskActionText = (taskType) => {
  if (!taskType) return "View";
  const actionTextMap = {
    // Brand tasks
    [TASK_TYPE.REVIEW_DRAFT]: "Review submission",
    [TASK_TYPE.REVIEW_REVISION]: "Review submission",
    [TASK_TYPE.VERIFY_POST]: "View post",
    [TASK_TYPE.OVERDUE_ACTION]: "Send message",
    [TASK_TYPE.UNREAD_MESSAGE]: "View message",
    [TASK_TYPE.RESOLVE_BLOCKED]: "View creator status",
    // Creator tasks
    [TASK_TYPE.SIGN_AGREEMENT]: "Sign Agreement",
    [TASK_TYPE.SUBMIT_FIRST_DRAFT]: "Submit Content",
    [TASK_TYPE.SUBMIT_REVISED_DRAFT]: "Submit Content",
    [TASK_TYPE.PUBLISH_FINAL_POST]: "Publish Content",
    [TASK_TYPE.SUBMIT_POST_LINK]: "Submit Content",
    [TASK_TYPE.REPLY_TO_BRAND]: "Reply to Brand",
    [TASK_TYPE.FIX_PAYMENT]: "Fix Payment",
  };

  return actionTextMap[taskType] || "View";
};

/**
 * Navigate to the appropriate page for a task
 * For brand tasks: Navigate to Active Campaigns, select campaign, open creator
 * For creator tasks: Navigate to appropriate page based on task type
 */
export const navigateToTask = (task, router, dispatch, setSelectedCampaign, openMessageThread = null) => {
  if (!task) return;

  const { campaign, creator, task_type, metadata } = task;
  
  // Handle tasks without campaigns (e.g., SIGN_AGREEMENT for individual collaborations)
  if (!campaign && task_type !== TASK_TYPE.SIGN_AGREEMENT && task_type !== TASK_TYPE.FIX_PAYMENT) {
    return;
  }

  // Brand tasks - navigate to Active Campaigns
  const isBrandTask = [
    TASK_TYPE.REVIEW_DRAFT,
    TASK_TYPE.REVIEW_REVISION,
    TASK_TYPE.VERIFY_POST,
    TASK_TYPE.OVERDUE_ACTION,
    TASK_TYPE.UNREAD_MESSAGE,
    TASK_TYPE.RESOLVE_BLOCKED,
  ].includes(task_type);

  if (isBrandTask) {
    // Set campaign context
    if (setSelectedCampaign && campaign?.id) {
      dispatch(
        setSelectedCampaign({
          campaignId: campaign.id,
          collaborationType: campaign.collaboration_type || null,
        })
      );
    }

    // Navigate to active campaigns
    router.push("/campaigns/active");

    // Store creator ID in sessionStorage for auto-selection after navigation
    if (creator?.id) {
      sessionStorage.setItem("taskCreatorId", creator.id);
      sessionStorage.setItem("taskCampaignId", campaign.id);
      sessionStorage.setItem("taskType", task_type);

      // For message tasks, try to open message thread directly if available
      if (task_type === TASK_TYPE.UNREAD_MESSAGE) {
        if (openMessageThread && campaign?.id && creator?.id) {
          // openMessageThread is async, but we don't need to wait
          openMessageThread(campaign.id, creator.id);
          return; // Don't navigate, just open modal
        } else if (metadata?.conversation_id) {
          sessionStorage.setItem("taskConversationId", metadata.conversation_id);
        }
      }
    }
  } else {
    // Creator tasks - navigate based on task type
    switch (task_type) {
      case TASK_TYPE.SIGN_AGREEMENT:
        router.push("/campaigns/applications");
        break;
      case TASK_TYPE.SUBMIT_FIRST_DRAFT:
      case TASK_TYPE.SUBMIT_REVISED_DRAFT:
      case TASK_TYPE.PUBLISH_FINAL_POST:
      case TASK_TYPE.SUBMIT_POST_LINK:
        router.push("/campaigns/active");
        if (campaign?.id) {
          sessionStorage.setItem("taskCampaignId", campaign.id);
          sessionStorage.setItem("taskType", task_type);
        }
        break;
      case TASK_TYPE.REPLY_TO_BRAND:
        // For creator reply tasks, open message thread if available, otherwise navigate
        if (openMessageThread && campaign?.id && creator?.id) {
          openMessageThread(campaign.id, creator.id);
        } else {
          router.push("/campaigns/active");
          if (campaign?.id && metadata?.conversation_id) {
            sessionStorage.setItem("taskCampaignId", campaign.id);
            sessionStorage.setItem("taskConversationId", metadata.conversation_id);
          }
        }
        break;
      case TASK_TYPE.FIX_PAYMENT:
        router.push("/settings/payout-method");
        break;
      default:
        router.push("/campaigns/active");
    }
  }
};

/**
 * Format task name for display
 */
export const formatTaskName = (task) => {
  return task.task_name || "Task";
};

/**
 * Get task priority indicator (overdue, due soon, normal)
 */
export const getTaskPriority = (task) => {
  if (task.is_overdue) return "overdue";
  if (task.due_date) {
    const dueDate = new Date(task.due_date);
    const now = new Date();
    const hoursUntilDue = (dueDate - now) / (1000 * 60 * 60);
    if (hoursUntilDue < 24 && hoursUntilDue > 0) return "due-soon";
  }
  return "normal";
};

