import api from "@/common/utils/api";

// Create a new task
const createTask = async (taskData) => {
  const response = await api().post(`/campaign-tasks/campaign/${taskData.campaign_id}`, {
    task_name: taskData.task_name,
    status: taskData.status || "review",
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

const campaignTaskService = {
  createTask,
  getAllTasks,
  getTasksByCampaign,
  getTaskById,
  updateTask,
  deleteTask,
};

export default campaignTaskService;
