import api from "@/common/utils/api";

// Create campaign review
const createCampaignReview = async (campaignId, reviewData) => {
  const response = await api().post(`/campaign-reviews/campaign/${campaignId}`, reviewData);
  return response.data;
};

// Get all reviews for a campaign
const getCampaignReviews = async (campaignId) => {
  const response = await api().get(`/campaign-reviews/campaign/${campaignId}`);
  return response.data;
};

// Update campaign review
const updateCampaignReview = async (reviewId, reviewData) => {
  const response = await api().put(`/campaign-reviews/${reviewId}`, reviewData);
  return response.data;
};

// Delete campaign review
const deleteCampaignReview = async (reviewId) => {
  const response = await api().delete(`/campaign-reviews/${reviewId}`);
  return response.data;
};

const campaignReviewsService = {
  createCampaignReview,
  getCampaignReviews,
  updateCampaignReview,
  deleteCampaignReview,
};

export default campaignReviewsService;
