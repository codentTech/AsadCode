import React, { useState } from "react";

function usePrivateCampaignForm() {
  const [currentDeliverable, setCurrentDeliverable] = useState("");
  const [campaignData, setCampaignData] = useState({
    title: "",
    type: "",
    deliverables: [],
    payment: "",
    dueDate: null,
    brief: "",
  });

  const handleChange = (field, value) => {
    setCampaignData({
      ...campaignData,
      [field]: value,
    });
  };

  const handleSubmit = () => {
    // Process the campaign data
    onClose();
  };

  const campaignTypes = [
    { value: "sponsored", label: "Sponsored Post" },
    { value: "ugc", label: "UGC (User Generated Content)" },
    { value: "affiliate", label: "Affiliate" },
    { value: "gifted", label: "Gifted" },
  ];

  const setDeliverables = (newDeliverables) => {
    setCampaignData({
      ...campaignData,
      deliverables: newDeliverables,
    });
  };

  const handleAddDeliverable = () => {
    if (!currentDeliverable.trim()) {
      return;
    }

    // Check for duplicates
    if (campaignData.deliverables.includes(currentDeliverable.trim())) {
      return;
    }

    setDeliverables([...campaignData.deliverables, currentDeliverable.trim()]);
    setCurrentDeliverable("");
  };

  const handleRemoveDeliverable = (index) => {
    const newDeliverables = [...campaignData.deliverables];
    newDeliverables.splice(index, 1);
    setDeliverables(newDeliverables);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddDeliverable();
    }
  };

  const addSuggestion = (suggestion) => {
    if (!campaignData.deliverables.includes(suggestion)) {
      setDeliverables([...campaignData.deliverables, suggestion]);
    }
  };
  return {
    currentDeliverable,
    setCurrentDeliverable,
    campaignData,
    handleChange,
    handleSubmit,
    campaignTypes,
    handleAddDeliverable,
    handleRemoveDeliverable,
    handleKeyPress,
    addSuggestion,
  };
}

export default usePrivateCampaignForm;
