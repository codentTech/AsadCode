import api from "@/common/utils/api";

// Create a new content planner
const createContentPlanner = async (campaignId, contentPlannerData) => {
  const response = await api().post(`/content-planner/campaign/${campaignId}`, {
    title: contentPlannerData.title,
    sections: contentPlannerData.sections,
  });
  return response.data;
};

// Get all content planners for the current creator
const getAllContentPlanners = async () => {
  const response = await api().get("/content-planner");
  return response.data;
};

// Get content planner for a specific campaign
const getContentPlannerByCampaign = async (campaignId) => {
  const response = await api().get(`/content-planner/campaign/${campaignId}`);
  return response.data;
};

// Get a specific content planner by ID
const getContentPlannerById = async (id) => {
  const response = await api().get(`/content-planner/${id}`);
  return response.data;
};

// Update a content planner
const updateContentPlanner = async (id, updateData) => {
  const response = await api().put(`/content-planner/${id}`, {
    title: updateData.title,
  });
  return response.data;
};

// Delete a content planner
const deleteContentPlanner = async (id) => {
  const response = await api().delete(`/content-planner/${id}`);
  return response.data;
};

const createContentPlannerSection = async (plannerId, payload) => {
  const response = await api().post(`/content-planner/${plannerId}/sections`, {
    title: payload.title,
    content: payload.content,
    position: payload.position,
  });
  return response.data;
};

const updateContentPlannerSection = async (sectionId, payload) => {
  const response = await api().patch(`/content-planner/sections/${sectionId}`, {
    title: payload.title,
    content: payload.content,
    position: payload.position,
  });
  return response.data;
};

const deleteContentPlannerSection = async (sectionId) => {
  const response = await api().delete(`/content-planner/sections/${sectionId}`);
  return response.data;
};

const contentPlannerService = {
  createContentPlanner,
  getAllContentPlanners,
  getContentPlannerByCampaign,
  getContentPlannerById,
  updateContentPlanner,
  deleteContentPlanner,
  createContentPlannerSection,
  updateContentPlannerSection,
  deleteContentPlannerSection,
};

export default contentPlannerService;
