import api from "@/common/utils/api";

const getCompletedCampaignReport = async (campaignId) => {
  const response = await api().get(`/campaigns/${campaignId}/completed-report`);
  return response.data;
};

const campaignReportService = {
  getCompletedCampaignReport,
};

export default campaignReportService;
