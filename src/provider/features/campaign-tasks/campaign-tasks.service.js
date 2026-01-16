import api from "@/common/utils/api";
import { TASK_STATUS } from "@/common/constants/campaign.constant";

// Create a new task
const createTask = async (taskData) => {
  const response = await api().post(`/campaign-tasks/campaign/${taskData.campaign_id}`, {
    task_name: taskData.task_name,
    status: taskData.status || TASK_STATUS.REVIEW,
  });
  return response.data;
};

// Get all tasks
const getAllTasks = async () => {
  const response = await api().get("/campaign-tasks");
  return response.data;
};

// Get tasks by campaign
const getTasksByCampaign = async (campaignId) => {
  const response = await api().get(`/campaign-tasks/campaign/${campaignId}`);
  return response.data;
};

// Get task by ID
const getTaskById = async (taskId) => {
  const response = await api().get(`/campaign-tasks/${taskId}`);
  return response.data;
};

// Update task
const updateTask = async (taskId, updateData) => {
  const response = await api().put(`/campaign-tasks/${taskId}`, updateData);
  return response.data;
};

// Delete task
const deleteTask = async (taskId) => {
  const response = await api().delete(`/campaign-tasks/${taskId}`);
  return { ...response.data, taskId };
};

// Get brand tasks (with optional campaign filter)
const getBrandTasks = async (campaignId = null) => {
  const url = campaignId
    ? `/campaign-tasks/brand?campaignId=${campaignId}`
    : "/campaign-tasks/brand";
  const response = await api().get(url);
  return response.data;
};

// Get creator tasks
const getCreatorTasks = async () => {
  const response = await api().get("/campaign-tasks/creator");
  return response.data;
};

const campaignTaskService = {
  createTask,
  getAllTasks,
  getTasksByCampaign,
  getTaskById,
  updateTask,
  deleteTask,
  getBrandTasks,
  getCreatorTasks,
};

export default campaignTaskService;
