import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createTask,
  getAllTasks,
  updateTask,
} from "@/provider/features/campaign-tasks/campaign-tasks.slice";
import { getAllCampaigns } from "@/provider/features/campaigns/campaigns.slice";
import { TASK_STATUS } from "@/common/constants/campaign.constant";

export default function useTaskManager(show, propSelectedCampaign, isMultiCreator = true) {
  const dispatch = useDispatch();

  // Redux state
  const {
    tasks,
    createTask: createTaskState,
    updateTask: updateTaskState,
    deleteTask: deleteTaskState,
    getAllTasks: getAllTasksState,
  } = useSelector((state) => state.campaignTasks);

  const { data: campaignsData } = useSelector((state) => state.campaigns.getAllCampaigns || {});

  // Local state
  const [selectedCampaign, setSelectedCampaign] = useState("all");
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskText, setNewTaskText] = useState("");

  // Extract campaigns from the nested structure
  const campaigns = campaignsData?.data?.campaigns || campaignsData?.data || [];

  // Create a campaign lookup map for efficient title retrieval
  const campaignLookup = campaigns.reduce((acc, campaign) => {
    acc[campaign.id] = campaign.campaign_title;
    return acc;
  }, {});

  // Transform campaigns for dropdown
  const campaignOptions = [
    { label: "All Campaigns", value: "all" },
    ...(campaigns || []).map((campaign) => ({
      label: campaign.campaign_title,
      value: campaign.id,
    })),
  ];

  // Filter tasks based on selected campaign
  const filteredTasks = tasks.filter((task) => {
    if (selectedCampaign === "all") return true;
    // Match by campaign ID (handles both multi-creator and individual creator)
    return task.campaign?.id === selectedCampaign || task.campaign_id === selectedCampaign;
  });

  // Auto-select campaign for multi-creator mode
  useEffect(() => {
    if (show && propSelectedCampaign?.id) {
      setSelectedCampaign(propSelectedCampaign.id);
    }
  }, [show, propSelectedCampaign?.id]);

  // Load data when modal opens
  useEffect(() => {
    if (show) {
      dispatch(getAllTasks());
      if (isMultiCreator) {
        dispatch(getAllCampaigns());
      }
    }
  }, [show, dispatch, isMultiCreator]);

  // Refresh tasks when createTask is successful
  useEffect(() => {
    if (createTaskState.isSuccess && !createTaskState.isLoading) {
      dispatch(getAllTasks());
    }
  }, [createTaskState.isSuccess, createTaskState.isLoading, dispatch]);

  // Refresh tasks when updateTask is successful
  useEffect(() => {
    if (updateTaskState.isSuccess && !updateTaskState.isLoading) {
      dispatch(getAllTasks());
    }
  }, [updateTaskState.isSuccess, updateTaskState.isLoading, dispatch]);

  // Handle task action - mark as complete
  const handleTaskAction = async (task) => {
    try {
      await dispatch(
        updateTask({
          taskId: task.id,
          updateData: { status: TASK_STATUS.COMPLETE },
        })
      ).unwrap();
      // Tasks will be refreshed by useEffect watching updateTaskState.isSuccess
    } catch (error) {
      // Error is handled by Redux state
      console.error("Failed to update task:", error);
    }
  };

  // Add custom task
  const addCustomTask = async () => {
    const campaignId = isMultiCreator
      ? selectedCampaign !== "all" ? selectedCampaign : null
      : propSelectedCampaign?.id; // Use synthetic campaign ID for individual creator

    if (newTaskText.trim() && campaignId) {
      try {
        await dispatch(
          createTask({
            task_name: newTaskText,
            campaign_id: campaignId,
          })
        ).unwrap();

        // Refresh tasks after successful creation
        await dispatch(getAllTasks());

        setNewTaskText("");
        setShowAddTask(false);
      } catch (error) {
        // Error is handled by Redux state
        console.error("Failed to create task:", error);
      }
    }
  };

  // Handle campaign selection change
  const handleCampaignSelect = ({ value }) => {
    setSelectedCampaign(value);
  };


  // Handle new task text change
  const handleNewTaskTextChange = (e) => {
    setNewTaskText(e.target.value);
  };

  // Toggle add task form
  const toggleAddTask = () => {
    setShowAddTask(true);
  };

  // Cancel add task
  const cancelAddTask = () => {
    setShowAddTask(false);
    setNewTaskText("");
  };

  return {
    // State
    selectedCampaign,
    showAddTask,
    newTaskText,
    tasks,
    filteredTasks,
    campaignOptions,
    campaignLookup,

    // Redux states
    createTaskState,
    updateTaskState,
    getAllTasksState,

    // Actions
    handleTaskAction,
    addCustomTask,
    handleCampaignSelect,
    handleNewTaskTextChange,
    toggleAddTask,
    cancelAddTask,
  };
}
