import api from "@/common/utils/api";

// Create a new calendar task
const createTask = async (taskData) => {
  const response = await api().post(`/calendar-tasks/campaign/${taskData.campaign_id}`, {
    task_text: taskData.task_text,
    task_date: taskData.task_date,
    tag_label: taskData.tag_label,
    tag_color: taskData.tag_color,
    is_auto_generated: taskData.is_auto_generated || false,
  });
  return response.data;
};

// Get all calendar tasks
const getAllTasks = async () => {
  const response = await api().get("/calendar-tasks");
  return response.data;
};

// Get tasks by month
const getTasksByMonth = async (month, year) => {
  const response = await api().get(`/calendar-tasks/month/${month}/${year}`);
  return response.data;
};

// Get tasks by campaign
const getTasksByCampaign = async (campaignId) => {
  const response = await api().get(`/calendar-tasks/campaign/${campaignId}`);
  return response.data;
};

// Update calendar task
const updateTask = async (taskId, updateData) => {
  const response = await api().put(`/calendar-tasks/${taskId}`, updateData);
  return response.data;
};

// Toggle task status
const toggleTaskStatus = async (taskId) => {
  const response = await api().put(`/calendar-tasks/${taskId}/toggle`);
  return response.data;
};

// Delete calendar task
const deleteTask = async (taskId) => {
  const response = await api().delete(`/calendar-tasks/${taskId}`);
  return { ...response.data, taskId };
};

const calendarTaskService = {
  createTask,
  getAllTasks,
  getTasksByMonth,
  getTasksByCampaign,
  updateTask,
  toggleTaskStatus,
  deleteTask,
};

export default calendarTaskService;
