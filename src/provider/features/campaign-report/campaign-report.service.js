import api from "@/common/utils/api";

const getCompletedCampaignReport = async (campaignId) => {
  const response = await api().get(`/campaigns/${campaignId}/completed-report`);
  return response.data;
};

const downloadCompletedCampaignReportPdf = async (campaignId) => {
  const response = await api().get(`/campaigns/${campaignId}/completed-report/pdf`, {
    responseType: "blob",
  });
  return response;
};

const campaignReportService = {
  getCompletedCampaignReport,
  downloadCompletedCampaignReportPdf,
};

export default campaignReportService;
