import api from "@/common/utils/api";

// Create a new calendar category
const createCategory = async (categoryData) => {
  const response = await api().post(
    `/calendar-tasks/categories/campaign/${categoryData.campaign_id}`,
    {
      label: categoryData.label,
      color: categoryData.color,
    }
  );
  return response.data;
};

// Get all calendar categories
const getAllCategories = async () => {
  const response = await api().get("/calendar-tasks/categories");
  return response.data;
};

// Get categories by campaign
const getCategoriesByCampaign = async (campaignId) => {
  const response = await api().get(`/calendar-tasks/categories/campaign/${campaignId}`);
  return response.data;
};

// Delete calendar category
const deleteCategory = async (categoryId) => {
  const response = await api().delete(`/calendar-tasks/categories/${categoryId}`);
  return response.data;
};

const calendarCategoryService = {
  createCategory,
  getAllCategories,
  getCategoriesByCampaign,
  deleteCategory,
};

export default calendarCategoryService;
