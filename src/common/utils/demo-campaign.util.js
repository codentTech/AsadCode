export const DEMO_CAMPAIGN_BANNER_COPY =
  "Demo Campaign — creators and data shown are fictional.";

export const DEMO_MUTATION_MESSAGES = {
  sendOffer: "Sending is disabled for the sample campaign.",
  reject: "Rejecting applicants is disabled for the sample campaign.",
  sendMessage: "Sending messages is disabled for the sample campaign.",
  bulkMessage: "Bulk messaging is disabled for the sample campaign.",
  calendarSchedule: "Scheduling is disabled for the sample campaign.",
  calendarToggle: "Updating calendar events is disabled for the sample campaign.",
  calendarCategory: "Updating calendar categories is disabled for the sample campaign.",
  pdfExport: "PDF export is disabled for the sample campaign.",
};

export function isDemoCampaign(campaign) {
  if (!campaign) return false;
  if (campaign.is_demo || campaign.isDemo) return true;
  const title = campaign.campaign_title || campaign.title || "";
  return typeof title === "string" && title.includes("Demo Campaign");
}

export function countRealCampaigns(campaigns = []) {
  return (campaigns || []).filter((c) => c && !c.is_demo && !c.is_deleted).length;
}

export function findDemoCampaign(campaigns = []) {
  return (campaigns || []).find((c) => isDemoCampaign(c) && !c.is_deleted) || null;
}

export function pickDefaultBrandCampaign(campaigns = [], candidates = null) {
  const list = candidates || campaigns || [];
  if (!list.length) return null;
  const realCount = countRealCampaigns(campaigns);
  if (realCount === 0) {
    const demo = list.find((c) => isDemoCampaign(c)) || findDemoCampaign(campaigns);
    if (demo) return demo;
  }
  return list.find((c) => !isDemoCampaign(c)) || list[0] || null;
}
