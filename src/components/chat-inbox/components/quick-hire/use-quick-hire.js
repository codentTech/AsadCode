import { useState } from "react";

export default function useQuickHire() {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  // Mock campaigns for the demo
  const publicCampaigns = [
    { id: 1, title: "Summer Collection Launch", status: "Open" },
    { id: 2, title: "New Product Teaser", status: "Open" },
    { id: 3, title: "Holiday Special", status: "Open" },
  ];

  return {
    handleOptionSelect,
    publicCampaigns,
    selectedOption,
  };
}
