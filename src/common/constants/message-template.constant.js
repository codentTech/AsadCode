import { ArrowLeftRight, CheckCircle, Play, Send } from "lucide-react";

export const MESSAGE_TEMPLATE_CATEGORIES = Object.freeze({
  OUTREACH: "outreach",
  NEGOTIATION: "negotiation",
  ACTIVE: "active",
  COMPLETED: "completed",
});

export const MESSAGE_TEMPLATE_CATEGORY_CONFIG = [
  {
    value: MESSAGE_TEMPLATE_CATEGORIES.OUTREACH,
    label: "Outreach",
    icon: Send,
  },
  {
    value: MESSAGE_TEMPLATE_CATEGORIES.NEGOTIATION,
    label: "Negotiation",
    icon: ArrowLeftRight,
  },
  {
    value: MESSAGE_TEMPLATE_CATEGORIES.ACTIVE,
    label: "Active",
    icon: Play,
  },
  {
    value: MESSAGE_TEMPLATE_CATEGORIES.COMPLETED,
    label: "Completed",
    icon: CheckCircle,
  },
];

export const DEFAULT_MESSAGE_TEMPLATE_CATEGORY = MESSAGE_TEMPLATE_CATEGORIES.OUTREACH;
