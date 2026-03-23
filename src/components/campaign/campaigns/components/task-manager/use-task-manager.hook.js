import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createTask,
  getAllTasks,
  updateTask,
} from "@/provider/features/campaign-tasks/campaign-tasks.slice";
import { getAllCampaigns } from "@/provider/features/campaigns/campaigns.slice";
import { TASK_STATUS } from "@/common/constants/campaign.constant";

export default function useTaskManager(show) {
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
  const [newTaskCampaign, setNewTaskCampaign] = useState("");

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
  const filteredTasks = tasks.filter(
    (task) => selectedCampaign === "all" || task.campaign?.id === selectedCampaign
  );

  // Load data when modal opens
  useEffect(() => {
    if (show) {
      dispatch(getAllTasks());
      dispatch(getAllCampaigns());
    }
  }, [show, dispatch]);

  // Handle task action - navigate to appropriate page
  // Tasks are state-driven and cannot be manually marked as complete
  // They disappear automatically when the underlying action is completed
  const handleTaskAction = async (task) => {
    // Navigate to the appropriate page based on task type
    // This should use the same navigation logic as the main task manager
    // For now, we'll just log - the navigation should be implemented based on task type
    console.log("Task action clicked - navigation should be implemented", task);
  };

  // Add custom task
  const addCustomTask = async () => {
    if (newTaskText.trim() && newTaskCampaign) {
      await dispatch(
        createTask({
          task_name: newTaskText,
          campaign_id: newTaskCampaign,
        })
      ).unwrap();

      setNewTaskText("");
      setNewTaskCampaign("");
      setShowAddTask(false);
    }
  };

  // Handle campaign selection change
  const handleCampaignSelect = ({ value }) => {
    setSelectedCampaign(value);
  };

  // Handle new task campaign selection
  const handleNewTaskCampaignSelect = ({ value }) => {
    setNewTaskCampaign(value);
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
    setNewTaskCampaign("");
  };

  return {
    // State
    selectedCampaign,
    showAddTask,
    newTaskText,
    newTaskCampaign,
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
    handleNewTaskCampaignSelect,
    handleNewTaskTextChange,
    toggleAddTask,
    cancelAddTask,
  };
}
