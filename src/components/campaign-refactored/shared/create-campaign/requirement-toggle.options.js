import { REQUIREMENT_LEVEL } from "@/common/constants/campaign.constant";

export const REQUIREMENT_TOGGLE_INACTIVE = "bg-gray-100 text-gray-600";

export const RIGHTS_TOGGLE_OPTIONS = [
  {
    value: "negotiable",
    label: "Negotiable",
    activeClasses: "bg-primary/10 text-primary",
    inactiveClasses: REQUIREMENT_TOGGLE_INACTIVE,
  },
  {
    value: "non_negotiable",
    label: "Non Negotiable",
    activeClasses: "bg-orange-100 text-orange-700",
    inactiveClasses: REQUIREMENT_TOGGLE_INACTIVE,
  },
];

export const PREFERRED_MANDATORY_TOGGLE_OPTIONS = [
  {
    value: REQUIREMENT_LEVEL.PREFERRED,
    label: "Preferred",
    activeClasses: "bg-primary/10 text-primary",
    inactiveClasses: REQUIREMENT_TOGGLE_INACTIVE,
  },
  {
    value: REQUIREMENT_LEVEL.MANDATORY,
    label: "Mandatory",
    activeClasses: "bg-orange-100 text-orange-700",
    inactiveClasses: REQUIREMENT_TOGGLE_INACTIVE,
  },
];
