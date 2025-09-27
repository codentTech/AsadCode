import api from "@/common/utils/api";

// Create a new monthly goal
const createMonthlyGoal = async (campaignId, monthlyGoalData) => {
  const response = await api().post(`/monthly-goals/campaign/${campaignId}`, {
    title: monthlyGoalData.title,
    completed: monthlyGoalData.completed || false,
    week_number: monthlyGoalData.week_number,
    month: monthlyGoalData.month,
    year: monthlyGoalData.year,
  });
  return response.data;
};

// Get all monthly goals for the current creator
const getAllMonthlyGoals = async () => {
  const response = await api().get("/monthly-goals");
  return response.data;
};

// Get monthly goals for a specific campaign and month/year
const getMonthlyGoalsByCampaign = async (campaignId, month, year) => {
  const response = await api().get(
    `/monthly-goals/campaign/${campaignId}?month=${month}&year=${year}`
  );
  return response.data;
};

// Get a specific monthly goal by ID
const getMonthlyGoalById = async (id) => {
  const response = await api().get(`/monthly-goals/${id}`);
  return response.data;
};

// Update a monthly goal
const updateMonthlyGoal = async (id, updateData) => {
  const response = await api().put(`/monthly-goals/${id}`, {
    title: updateData.title,
    completed: updateData.completed,
    week_number: updateData.week_number,
    month: updateData.month,
    year: updateData.year,
  });
  return response.data;
};

// Delete a monthly goal
const deleteMonthlyGoal = async (id) => {
  const response = await api().delete(`/monthly-goals/${id}`);
  return response.data;
};

const monthlyGoalService = {
  createMonthlyGoal,
  getAllMonthlyGoals,
  getMonthlyGoalsByCampaign,
  getMonthlyGoalById,
  updateMonthlyGoal,
  deleteMonthlyGoal,
};

export default monthlyGoalService;
