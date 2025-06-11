import { useState } from "react";

export function useCampaignFeed() {
  const [showFullBrief, setShowFullBrief] = useState(false);
  const [briefCampaign, setBriefCampaign] = useState(null);

  const [showApplication, setShowApplication] = useState(false);
  const [applicationCampaign, setApplicationCampaign] = useState(null);
  const [applicationPitch, setApplicationPitch] = useState("");

  const handleOpenBrief = (campaign) => {
    setBriefCampaign(campaign);
    setShowFullBrief(true);
  };

  const handleOpenApplication = (campaign) => {
    setApplicationCampaign(campaign);
    setShowApplication(true);
  };

  const closeBrief = () => {
    setShowFullBrief(false);
    setBriefCampaign(null);
  };

  const closeApplication = () => {
    setShowApplication(false);
    setApplicationCampaign(null);
    setApplicationPitch("");
  };

  return {
    showFullBrief,
    briefCampaign,
    showApplication,
    applicationCampaign,
    applicationPitch,
    setApplicationPitch,
    handleOpenBrief,
    handleOpenApplication,
    closeBrief,
    closeApplication,
  };
}
