import { useEffect, useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCreatorTasks } from "@/provider/features/campaign-tasks/campaign-tasks.slice";
import { getTaskActionText, formatTaskName, getTaskPriority } from "@/common/utils/task-utils.util";

export default function useCreatorTaskManager(
  setSelectedCampaign,
  getCampaignById,
  formatCampaignData
) {
  const dispatch = useDispatch();
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Redux state
  const { creatorTasks, getCreatorTasks: getCreatorTasksState } = useSelector(
    (state) => state.campaignTasks
  );

  // Sort tasks: overdue first, then oldest due date first
  // Use useMemo to prevent unnecessary re-sorting and blinking
  const sortedTasks = useMemo(() => {
    if (!creatorTasks || creatorTasks.length === 0) return [];

    return [...creatorTasks].sort((a, b) => {
      // Overdue tasks first
      if (a.is_overdue && !b.is_overdue) return -1;
      if (!a.is_overdue && b.is_overdue) return 1;

      // Then sort by due_date (oldest first), nulls last
      if (a.due_date && !b.due_date) return -1;
      if (!a.due_date && b.due_date) return 1;
      if (a.due_date && b.due_date) {
        const dueDateA = new Date(a.due_date);
        const dueDateB = new Date(b.due_date);
        if (dueDateA !== dueDateB) return dueDateA - dueDateB;
      }

      // Secondary sort by created_at for tasks with same due_date or both null
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      return dateA - dateB;
    });
  }, [creatorTasks]);

  // Load tasks on mount
  useEffect(() => {
    dispatch(getCreatorTasks());
  }, [dispatch]);

  // Mark initial load as complete once we have tasks or loading is done
  useEffect(() => {
    if (isInitialLoad && (!getCreatorTasksState?.isLoading || creatorTasks?.length > 0)) {
      setIsInitialLoad(false);
    }
  }, [isInitialLoad, getCreatorTasksState?.isLoading, creatorTasks]);

  // Poll for updates every 15 seconds (skip if a request is in-flight)
  // Only poll after initial load is complete
  useEffect(() => {
    if (isInitialLoad) return;

    const interval = setInterval(() => {
      if (!getCreatorTasksState?.isLoading) {
        dispatch(getCreatorTasks());
      }
    }, 15000);
    return () => clearInterval(interval);
  }, [dispatch, getCreatorTasksState?.isLoading, isInitialLoad]);

  // Handle task action button click - set selected campaign
  const handleTaskAction = useCallback(
    (task) => {
      if (!task?.campaign?.id || !setSelectedCampaign) return;

      // Find the campaign from active campaigns and format it
      const campaignData = getCampaignById?.(task.campaign.id);
      if (campaignData && formatCampaignData) {
        const formattedCampaign = formatCampaignData(campaignData);
        setSelectedCampaign(formattedCampaign);
      }
    },
    [setSelectedCampaign, getCampaignById, formatCampaignData]
  );

  // Get action button text for a task
  const getActionText = useCallback((task) => {
    return getTaskActionText(task.task_type);
  }, []);

  // Format task name
  const formatName = useCallback((task) => {
    return formatTaskName(task);
  }, []);

  // Get task priority
  const getPriority = useCallback((task) => {
    return getTaskPriority(task);
  }, []);

  return {
    // State
    tasks: sortedTasks,
    getCreatorTasksState,
    isInitialLoad,

    // Actions
    handleTaskAction,
    getActionText,
    formatName,
    getPriority,
  };
}
