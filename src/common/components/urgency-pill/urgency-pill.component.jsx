import React from "react";
import { URGENCY_PILL_CLASSES } from "@/common/constants/creator-urgency.constant";

const UrgencyPill = ({ label, tier }) => {
  if (!label) return null;

  const pillClass = URGENCY_PILL_CLASSES[tier] || URGENCY_PILL_CLASSES.amber;

  return (
    <span
      className={`inline-flex w-fit max-w-full shrink-0 items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium sm:px-2 sm:text-xs ${pillClass}`}
    >
      {label}
    </span>
  );
};

export default UrgencyPill;
